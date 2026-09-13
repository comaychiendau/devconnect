using DevConnect.Api.Data;
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
}