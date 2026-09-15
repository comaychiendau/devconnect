using DevConnect.Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DevConnect.Api.Data;

public class ApplicationDbContext(
    DbContextOptions<ApplicationDbContext> options)
    : IdentityDbContext<ApplicationUser>(options)
{
    public DbSet<Community> Communities =>
        Set<Community>();

    public DbSet<CommunityMembership> CommunityMemberships =>
        Set<CommunityMembership>();

    protected override void OnModelCreating(
        ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<CommunityMembership>(
            membership =>
            {
                membership.HasKey(item => new
                {
                    item.UserId,
                    item.CommunityId,
                });

                membership
                    .HasOne<ApplicationUser>()
                    .WithMany()
                    .HasForeignKey(item => item.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                membership
                    .HasOne<Community>()
                    .WithMany()
                    .HasForeignKey(item => item.CommunityId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
    }
}