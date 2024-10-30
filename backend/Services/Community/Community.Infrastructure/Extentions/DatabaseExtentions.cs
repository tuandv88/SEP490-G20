

namespace Community.Infrastructure.Extentions;
public static class DatabaseExtentions {
    public static async Task InitialiseDatabaseAsync(this WebApplication app) {
        using var scope = app.Services.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        context.Database.MigrateAsync().GetAwaiter().GetResult();

        await SeedAsync(context);
    }

    private static async Task SeedAsync(ApplicationDbContext context) {
        await SeedCategoryAsync(context);
        await SeedDiscussionAsync(context);
        //TODO
    }

    private static async Task SeedCategoryAsync(ApplicationDbContext context)
    {
        //TODO
    }

    private static async Task SeedDiscussionAsync(ApplicationDbContext context) {
        if (!await context.Discussions.AnyAsync()) {
            await context.Discussions.AddRangeAsync(InitialData.Discussions);
            await context.SaveChangesAsync();
        }
    }
}

