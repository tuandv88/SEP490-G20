using AI.Application.Data;
using AI.Infrastructure.Data;
using AI.Infrastructure.Data.Interceptors;
using BuildingBlocks.Extensions;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace AI.Infrastructure;
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
        services.AddConfigureCaching(configuration);

        //Configuration Repository
        ConfigureRepository(services, configuration);

        return services;
    }
    private static void ConfigureRepository(IServiceCollection services, IConfiguration configuration) {
    }
}

