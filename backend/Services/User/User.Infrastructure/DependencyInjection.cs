using BuildingBlocks.Extensions;
using Learning.Infrastructure.Data.Interceptors;

using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging;
using User.Application.Data.Repositories;
using User.Infrastructure.Data.Repositories.LearningPaths;
using User.Infrastructure.Data.Repositories.PathSteps;
using User.Infrastructure.Data.Repositories.PointHistories;
using User.Infrastructure.Data.Repositories.UserGoals;

namespace User.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            services.AddScoped<ISaveChangesInterceptor, AuditableEntityInterceptor>();
            services.AddScoped<ISaveChangesInterceptor, DispatchDomainEventsInterceptor>();

            services.AddDbContext<ApplicationDbContext>((sp, options) => {
                options.AddInterceptors(sp.GetServices<ISaveChangesInterceptor>());
                options.UseNpgsql(connectionString).LogTo(Console.WriteLine, LogLevel.Information); ;
            });

            services.AddHttpContextAccessor();
            services.AddScoped<IApplicationDbContext, ApplicationDbContext>();

            //Caching
            //services.ConfigureCaching(configuration);

            services.AddScoped<IPointHistoryRepository, PointHistoryRepository>();
            //services.AddScoped<IPointHistoryRepository, CachedPointHistoryRepository>();

            services.AddScoped<ILearningPathRepository, LearningPathRepository>();
//services.AddScoped<ILearningPathRepository, CachedLearningPathRepository>();

            services.AddScoped<IPathStepsRepository, PathStepsRepository>();
            //services.AddScoped<IPathStepsRepository, CachedPathStepRepository>();

            services.AddScoped<IUserGoalRepository, UserGoalRepository>();
           // services.AddScoped<IUserGoalRepository, CachedUserGoalRepository>();

            return services;
        }
    }

}
