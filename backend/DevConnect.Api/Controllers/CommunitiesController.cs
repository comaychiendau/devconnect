using System.Security.Claims;
using DevConnect.Api.Data;
using DevConnect.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DevConnect.Api.Controllers;

[ApiController]
[Route("api/communities")]
public class CommunitiesController(
    ApplicationDbContext dbContext) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Get(
        CancellationToken cancellationToken)
    {
        var communities = await dbContext.Communities
            .AsNoTracking()
            .OrderBy(community => community.Name)
            .Select(community => new
            {
                community.Id,
                community.Name,
                community.Description,
            })
            .ToListAsync(cancellationToken);

        return Ok(communities);
    }

    [HttpGet("joined")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetJoined(
        CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        var communities = await dbContext
            .CommunityMemberships
            .AsNoTracking()
            .Where(membership =>
                membership.UserId == userId)
            .Join(
                dbContext.Communities.AsNoTracking(),
                membership => membership.CommunityId,
                community => community.Id,
                (membership, community) => community)
            .OrderBy(community => community.Name)
            .Select(community => new
            {
                community.Id,
                community.Name,
                community.Description,
            })
            .ToListAsync(cancellationToken);

        return Ok(communities);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(
        int id,
        CancellationToken cancellationToken)
    {
        var community = await dbContext.Communities
            .AsNoTracking()
            .Where(community => community.Id == id)
            .Select(community => new
            {
                community.Id,
                community.Name,
                community.Description,
            })
            .SingleOrDefaultAsync(cancellationToken);

        if (community is null)
        {
            return NotFound(new
            {
                message = "Community not found.",
            });
        }
        return Ok(community);
    }



    [HttpPost("{communityId:int}/join")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Join(
        int communityId,
        CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        var communityExists =
            await dbContext.Communities.AnyAsync(
                community => community.Id == communityId,
                cancellationToken);

        if (!communityExists)
        {
            return NotFound(new
            {
                message = "Community not found.",
            });
        }

        var alreadyJoined =
            await dbContext.CommunityMemberships.AnyAsync(
                membership =>
                    membership.UserId == userId &&
                    membership.CommunityId == communityId,
                cancellationToken);

        if (alreadyJoined)
        {
            return NoContent();
        }

        var membership = new CommunityMembership
        {
            UserId = userId,
            CommunityId = communityId,
        };

        dbContext.CommunityMemberships.Add(membership);

        try
        {
            await dbContext.SaveChangesAsync(
                cancellationToken);
        }
        catch (DbUpdateException)
        {
            dbContext.Entry(membership).State =
                EntityState.Detached;

            var membershipNowExists =
                await dbContext.CommunityMemberships
                    .AsNoTracking()
                    .AnyAsync(
                        item =>
                            item.UserId == userId &&
                            item.CommunityId ==
                            communityId,
                        cancellationToken);

            if (membershipNowExists)
            {
                return NoContent();
            }

            throw;
        }

        return NoContent();
    }

    [HttpDelete("{communityId:int}/leave")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Leave(
        int communityId,
        CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        var communityExists =
            await dbContext.Communities.AnyAsync(
                community => community.Id == communityId,
                cancellationToken);

        if (!communityExists)
        {
            return NotFound(new
            {
                message = "Community not found.",
            });
        }

        var membership =
            await dbContext.CommunityMemberships
                .SingleOrDefaultAsync(
                    item =>
                        item.UserId == userId &&
                        item.CommunityId == communityId,
                    cancellationToken);

        if (membership is null)
        {
            return NoContent();
        }

        dbContext.CommunityMemberships.Remove(membership);

        await dbContext.SaveChangesAsync(
            cancellationToken);

        return NoContent();
    }

    private string? GetCurrentUserId()
    {
        return User.FindFirstValue(
            ClaimTypes.NameIdentifier);
    }
}