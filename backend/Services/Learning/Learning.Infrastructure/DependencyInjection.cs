using BuildingBlocks.Extensions;
using Learning.Infrastructure.Data.Interceptors;
using Learning.Infrastructure.Data.Repositories.Chapters;
using Learning.Infrastructure.Data.Repositories.Courses;
using Learning.Infrastructure.Data.Repositories.Lectures;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging;

namespace Learning.Infrastructure;
public static class DependencyInjection {
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration) {
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
        services.ConfigureCaching(configuration);

        //Caching CourseRepository
        services.AddScoped<ICourseRepository, CourseRepository>();
        services.Decorate<ICourseRepository, CachedCourseRepository>();

        //ChapterRepository
        services.AddScoped<IChapterRepository, ChapterRepository>();

        //LectureRepository
        services.AddScoped<ILectureRepository, LectureRepository>();
        return services;
    }
}
