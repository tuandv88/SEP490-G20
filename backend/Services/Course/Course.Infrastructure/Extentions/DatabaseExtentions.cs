using Microsoft.AspNetCore.Builder;

namespace Course.Infrastructure.Extentions;
public static class DatabaseExtentions {
    public static async Task InitialiseDatabaseAsync(this WebApplication app) {
        using var scope = app.Services.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        context.Database.MigrateAsync().GetAwaiter().GetResult();

        await SeedAsync(context);
    }

    private static async Task SeedAsync(ApplicationDbContext context) {
        await SeedCourseAsync(context);
        await SeedChapterAsync(context);
        //TODO
    }

    private static async Task SeedChapterAsync(ApplicationDbContext context) {
        if (!await context.Courses.AnyAsync()) {
            await context.Courses.AddRangeAsync(InitialData.Courses);
            await context.SaveChangesAsync();
        }
    }

    private static async Task SeedCourseAsync(ApplicationDbContext context) {

    }
    //TODO
}

