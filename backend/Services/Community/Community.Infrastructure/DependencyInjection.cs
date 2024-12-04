using BuildingBlocks.Extensions;
using Community.Application.Interfaces;
using Community.Infrastructure.Data.Interceptors;
using Community.Infrastructure.Data.Repositories.Bookmarks;
using Community.Infrastructure.Data.Repositories.Categorys;
using Community.Infrastructure.Data.Repositories.Comments;
using Community.Infrastructure.Data.Repositories.Discussions;
using Community.Infrastructure.Data.Repositories.Flags;
using Community.Infrastructure.Data.Repositories.NotificationHistories;
using Community.Infrastructure.Data.Repositories.NotificationTypes;
using Community.Infrastructure.Data.Repositories.UserDiscussions;
using Community.Infrastructure.Data.Repositories.UserNotificationSettings;
using Community.Infrastructure.Data.Repositories.Votes;
using Community.Infrastructure.Extentions;
using Community.Infrastructure.Services;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Community.Infrastructure;
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>((sp, options) => {
            options.AddInterceptors(sp.GetServices<ISaveChangesInterceptor>());
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"),
                 npgsqlOptions => {
                     npgsqlOptions.EnableRetryOnFailure(5);
                 });

            options.LogTo(Console.WriteLine, LogLevel.Information);
        });
        services.AddMassTransitWithRabbitMQ(configuration, typeof(IApplicationDbContext).Assembly);

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

        //Configuration Repository
        ConfigureRepository(services, configuration);

        //IBase64Converter
        services.AddScoped<IBase64Converter, Base64Converter>();

        //Caching
        //services.AddConfigureCaching(configuration);

        services.AddHttpContextAccessor();

        //UserContext
        services.AddScoped<IUserContextService, UserContextService>();

        services.AddScoped<ISaveChangesInterceptor, AuditableEntityInterceptor>();

        services.AddScoped<ISaveChangesInterceptor, DispatchDomainEventsInterceptor>();


        return services;
    }
    private static void ConfigureRepository(IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        //services.Decorate<ICategoryRepository, CachedCategoryRepository>();

        services.AddScoped<IDiscussionRepository, DiscussionRepository>();
        //services.Decorate<IDiscussionRepository, CachedDiscussionRepository>();

        services.AddScoped<IVoteRepository, VoteRepository>();

        services.AddScoped<ICommentRepository, CommentRepository>();

        services.AddScoped<IBookmarkRepository, BookmarkReponsitory>();

        services.AddScoped<IUserDiscussionRepository, UserDiscussionRepository>();

        services.AddScoped<INotificationTypeRepository, NotificationTypeRepository>();

        services.AddScoped<INotificationHistoryRepository, NotificationHistoryRepository>();

        services.AddScoped<IUserNotificationSettingRepository, UserNotificationSettingRepository>();

        services.AddScoped<IFlagRepository, FlagRepository>();
    }
}
