using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Community.Infrastructure.Extensions;

namespace Community.API.Endpoints
{
    public static class SeedDataEndpoint
    {
        public static void MapSeedDataEndpoint(this WebApplication app)
        {
            app.MapPost("/seeddatacommunity", async (HttpContext context) =>
            {
                await app.InitialiseDatabaseAsync();
                await context.Response.WriteAsync("Database has been seeded if it was empty.");
            }).WithName("SeedData");
        }
    }
}
