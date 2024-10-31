using BuildingBlocks.Extensions;
using Community.Infrastructure.Data.Interceptors;
using Community.Infrastructure.Data.Repositories.Categorys;
using Community.Infrastructure.Data.Repositories.Discussions;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Community.Infrastructure;
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(connectionString).LogTo(Console.WriteLine, LogLevel.Information));

        services.AddScoped<IApplicationDbContext, ApplicationDbContext>();

        //Configuration Repository
        ConfigureRepository(services, configuration);

        //Caching
        services.AddConfigureCaching(configuration);

        services.AddHttpContextAccessor();

        services.AddScoped<ISaveChangesInterceptor, AuditableEntityInterceptor>();
        services.AddScoped<ISaveChangesInterceptor, DispatchDomainEventsInterceptor>();



        return services;
    }
    private static void ConfigureRepository(IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        //services.Decorate<ICategoryRepository, CategoryRepository>();

        services.AddScoped<IDiscussionRepository, DiscussionRepository>();
        //services.Decorate<ICategoryRepository, CategoryRepository>();


    }
}
