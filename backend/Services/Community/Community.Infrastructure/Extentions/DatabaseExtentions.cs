namespace Community.Infrastructure.Extensions
{
    public static class DatabaseExtensions
    {
        public static async Task InitialiseDatabaseAsync(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            // Áp dụng các migration
            await context.Database.MigrateAsync();

            // Seed dữ liệu với cùng một context
            await SeedAsync(context);
        }

        private static async Task SeedAsync(ApplicationDbContext context)
        {
            await SeedCategoriesAsync(context); // Seed Category trước
            await SeedDiscussionsAsync(context); // Seed Discussion sau khi Category
            await SeedCommentsAsync(context); // Seed Comment sau khi Discussion
            await SeedVotesAsync(context); // Seed Vote
            await SeedBookmarksAsync(context); // Seed Bookmark
            await SeedUserDiscussionsAsync(context); // Seed UserDiscussion
            await SeedNotificationTypesAsync(context); // Seed NotificationType
            await SeedUserNotificationSettingsAsync(context); // Seed UserNotificationSetting
            await SeedNotificationHistoriesAsync(context); // Seed NotificationHistory

        }



        private static async Task SeedCategoriesAsync(ApplicationDbContext context)
        {
            if (!await context.Categories.AnyAsync())
            {
                await context.Categories.AddRangeAsync(InitialData.Categories);
                await context.SaveChangesAsync();
            }
        }

        private static async Task SeedDiscussionsAsync(ApplicationDbContext context)
        {
            if (!await context.Discussions.AnyAsync())
            {
                await context.Discussions.AddRangeAsync(InitialData.Discussions);
                await context.SaveChangesAsync();
            }
        }

        

        private static async Task SeedCommentsAsync(ApplicationDbContext context)
        {
            if (!await context.Comments.AnyAsync())
            {
                await context.Comments.AddRangeAsync(InitialData.Comments);
                await context.SaveChangesAsync();
            }
        }

        private static async Task SeedVotesAsync(ApplicationDbContext context)
        {
            if (!await context.Votes.AnyAsync())
            {
                await context.Votes.AddRangeAsync(InitialData.Votes);
                await context.SaveChangesAsync();
            }
        }

        private static async Task SeedBookmarksAsync(ApplicationDbContext context)
        {
            if (!await context.Bookmarks.AnyAsync())
            {
                await context.Bookmarks.AddRangeAsync(InitialData.Bookmarks);
                await context.SaveChangesAsync();
            }
        }

        private static async Task SeedUserDiscussionsAsync(ApplicationDbContext context)
        {
            if (!await context.UserDiscussions.AnyAsync())
            {
                await context.UserDiscussions.AddRangeAsync(InitialData.UserDiscussions);
                await context.SaveChangesAsync();
            }
        }

        private static async Task SeedNotificationTypesAsync(ApplicationDbContext context)
        {
            if (!await context.NotificationTypes.AnyAsync())
            {
                await context.NotificationTypes.AddRangeAsync(InitialData.NotificationTypes);
                await context.SaveChangesAsync();
            }
        }

        private static async Task SeedUserNotificationSettingsAsync(ApplicationDbContext context)
        {
            if (!await context.UserNotificationSettings.AnyAsync())
            {
                await context.UserNotificationSettings.AddRangeAsync(InitialData.UserNotificationSettings);
                await context.SaveChangesAsync();
            }
        }

        private static async Task SeedNotificationHistoriesAsync(ApplicationDbContext context)
        {
            if (!await context.NotificationHistories.AnyAsync())
            {
                await context.NotificationHistories.AddRangeAsync(InitialData.NotificationHistories);
                await context.SaveChangesAsync();
            }
        }
    }
}
