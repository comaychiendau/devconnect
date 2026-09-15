using System.Net;
using System.Net.Http.Json;
using DevConnect.Api.Data;
using DevConnect.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace DevConnect.Api.Tests;

public sealed class CommunityMembershipEndpointsTests
    : IClassFixture<DevConnectApiFactory>
{
    private readonly DevConnectApiFactory _factory;

    public CommunityMembershipEndpointsTests(
        DevConnectApiFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task MembershipFlowWorks()
    {
        int communityId;

        await using (var scope =
            _factory.Services.CreateAsyncScope())
        {
            var dbContext =
                scope.ServiceProvider
                    .GetRequiredService<
                        ApplicationDbContext>();

            await dbContext.Database.EnsureCreatedAsync();

            dbContext.Users.Add(new ApplicationUser
            {
                Id = TestAuthHandler.UserId,
                UserName = "m18-user",
                NormalizedUserName = "M18-USER",
                Email = "m18@example.com",
                NormalizedEmail = "M18@EXAMPLE.COM",
                EmailConfirmed = true,
                FullName = "M18 Test User",
            });

            var community = new Community
            {
                Name = "M18 Test Community",
                Description =
                    "Community used by the membership test.",
            };

            dbContext.Communities.Add(community);

            await dbContext.SaveChangesAsync();

            communityId = community.Id;
        }

        using var guestClient =
            _factory.CreateClient();

        var guestJoinResponse =
            await guestClient.PostAsync(
                $"/api/communities/{communityId}/join",
                null);

        Assert.Equal(
            HttpStatusCode.Unauthorized,
            guestJoinResponse.StatusCode);

        var guestJoinedResponse =
            await guestClient.GetAsync(
                "/api/communities/joined");

        Assert.Equal(
            HttpStatusCode.Unauthorized,
            guestJoinedResponse.StatusCode);

        var guestLeaveResponse =
            await guestClient.DeleteAsync(
                $"/api/communities/{communityId}/leave");

        Assert.Equal(
            HttpStatusCode.Unauthorized,
            guestLeaveResponse.StatusCode);

        using var memberClient =
            _factory.CreateClient();

        memberClient.DefaultRequestHeaders.Add(
            TestAuthHandler.HeaderName,
            TestAuthHandler.UserId);

        var unknownJoinResponse =
            await memberClient.PostAsync(
                "/api/communities/999999/join",
                null);

        Assert.Equal(
            HttpStatusCode.NotFound,
            unknownJoinResponse.StatusCode);

        var firstJoinResponse =
            await memberClient.PostAsync(
                $"/api/communities/{communityId}/join",
                null);

        Assert.Equal(
            HttpStatusCode.NoContent,
            firstJoinResponse.StatusCode);

        var duplicateJoinResponse =
            await memberClient.PostAsync(
                $"/api/communities/{communityId}/join",
                null);

        Assert.Equal(
            HttpStatusCode.NoContent,
            duplicateJoinResponse.StatusCode);

        await using (var scope =
            _factory.Services.CreateAsyncScope())
        {
            var dbContext =
                scope.ServiceProvider
                    .GetRequiredService<
                        ApplicationDbContext>();

            var membershipCount =
                await dbContext.CommunityMemberships
                    .CountAsync(membership =>
                        membership.UserId ==
                            TestAuthHandler.UserId &&
                        membership.CommunityId ==
                            communityId);

            Assert.Equal(1, membershipCount);
        }

        var joinedResponse =
            await memberClient.GetAsync(
                "/api/communities/joined");

        Assert.Equal(
            HttpStatusCode.OK,
            joinedResponse.StatusCode);

        var joinedCommunities =
            await joinedResponse.Content
                .ReadFromJsonAsync<
                    List<CommunityResponse>>();

        Assert.NotNull(joinedCommunities);

        var joinedCommunity =
            Assert.Single(joinedCommunities);

        Assert.Equal(
            communityId,
            joinedCommunity.Id);

        Assert.Equal(
            "M18 Test Community",
            joinedCommunity.Name);

        var firstLeaveResponse =
            await memberClient.DeleteAsync(
                $"/api/communities/{communityId}/leave");

        Assert.Equal(
            HttpStatusCode.NoContent,
            firstLeaveResponse.StatusCode);

        var repeatedLeaveResponse =
            await memberClient.DeleteAsync(
                $"/api/communities/{communityId}/leave");

        Assert.Equal(
            HttpStatusCode.NoContent,
            repeatedLeaveResponse.StatusCode);

        var afterLeaveResponse =
            await memberClient.GetAsync(
                "/api/communities/joined");

        Assert.Equal(
            HttpStatusCode.OK,
            afterLeaveResponse.StatusCode);

        var afterLeaveCommunities =
            await afterLeaveResponse.Content
                .ReadFromJsonAsync<
                    List<CommunityResponse>>();

        Assert.NotNull(afterLeaveCommunities);
        Assert.Empty(afterLeaveCommunities);
    }

    private sealed record CommunityResponse(
        int Id,
        string Name,
        string Description);
}