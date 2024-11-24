using BuildingBlocks.Extensions;
using Elastic.CommonSchema;
using Learning.Infrastructure.Data.Interceptors;

using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging;
using User.Application.Data.Repositories;
using User.Infrastructure.Data.Repositories.LearningPaths;
using User.Infrastructure.Data.Repositories.PathSteps;
using User.Infrastructure.Data.Repositories.PointHistories;
using User.Infrastructure.Data.Repositories.UserGoals;
using User.Infrastructure.Extentions;

namespace User.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            services.AddDbContext<ApplicationDbContext>((sp, options) => {
                options.AddInterceptors(sp.GetServices<ISaveChangesInterceptor>());
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"),
                     npgsqlOptions => {
                         npgsqlOptions.EnableRetryOnFailure(5);
                     });

                options.LogTo(Console.WriteLine, LogLevel.Information);
            });
            services.AddMassTransitWithRabbitMQ(configuration, typeof(IApplicationDbContext).Assembly);

            //trong context đã tạo một ApplicationDbContext rồi, phải lấy ra chứ không add scoped mới 
            services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());
            services.AddScoped<ISaveChangesInterceptor, AuditableEntityInterceptor>();

            services.AddScoped<ISaveChangesInterceptor, DispatchDomainEventsInterceptor>();

            services.AddHttpContextAccessor();


            //Configuration Repository
            ConfigureRepository(services, configuration);


            return services;
        }
        private static void ConfigureRepository(IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IPointHistoryRepository, PointHistoryRepository>();

            services.AddScoped<ILearningPathRepository, LearningPathRepository>();

            services.AddScoped<IPathStepsRepository, PathStepsRepository>();

            services.AddScoped<IUserGoalRepository, UserGoalRepository>();

        }
    }
}






