using System.Data.Common;
using System.Security.Claims;
using System.Text.Encodings.Web;
using DevConnect.Api.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace DevConnect.Api.Tests;

public sealed class DevConnectApiFactory
    : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(
        IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureServices(services =>
        {
            services.RemoveAll<ApplicationDbContext>();

            services.RemoveAll<
                DbContextOptions<ApplicationDbContext>>();

            services.RemoveAll<
                IDbContextOptionsConfiguration<
                    ApplicationDbContext>>();

            services.RemoveAll<DbConnection>();

            services.AddSingleton<DbConnection>(_ =>
            {
                var connection = new SqliteConnection(
                    "DataSource=:memory:;Foreign Keys=True");

                connection.Open();

                return connection;
            });

            services.AddDbContext<ApplicationDbContext>(
                (serviceProvider, options) =>
                {
                    var connection =
                        serviceProvider
                            .GetRequiredService<
                                DbConnection>();

                    options.UseSqlite(connection);
                });

            services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme =
                        TestAuthHandler.SchemeName;

                    options.DefaultChallengeScheme =
                        TestAuthHandler.SchemeName;
                })
                .AddScheme<
                    AuthenticationSchemeOptions,
                    TestAuthHandler>(
                    TestAuthHandler.SchemeName,
                    _ => { });
        });
    }
}

internal sealed class TestAuthHandler(
    IOptionsMonitor<AuthenticationSchemeOptions> options,
    ILoggerFactory logger,
    UrlEncoder encoder)
    : AuthenticationHandler<
        AuthenticationSchemeOptions>(
        options,
        logger,
        encoder)
{
    public const string SchemeName = "M18Test";
    public const string HeaderName = "X-Test-User";
    public const string UserId = "m18-test-user";

    protected override Task<AuthenticateResult>
        HandleAuthenticateAsync()
    {
        if (!Request.Headers.TryGetValue(
                HeaderName,
                out var userId) ||
            string.IsNullOrWhiteSpace(userId.ToString()))
        {
            return Task.FromResult(
                AuthenticateResult.NoResult());
        }

        var claims = new[]
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                userId.ToString()),
            new Claim(
                ClaimTypes.Name,
                "M18 Test User"),
        };

        var identity = new ClaimsIdentity(
            claims,
            SchemeName);

        var principal = new ClaimsPrincipal(identity);

        var ticket = new AuthenticationTicket(
            principal,
            SchemeName);

        return Task.FromResult(
            AuthenticateResult.Success(ticket));
    }
}