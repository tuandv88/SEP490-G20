using Course.Infrastructure.Data.Interceptors;
using Microsoft.Extensions.Logging;

namespace Course.Infrastructure;
public static class DependencyInjection {
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration) {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        services.AddDbContext<ApplicationDbContext>((sp, options) => {
            options.UseNpgsql(connectionString).LogTo(Console.WriteLine, LogLevel.Information); ;
        });
        services.AddHttpContextAccessor();
        services.AddScoped<AuditableEntityInterceptor>();
        services.AddScoped<IApplicationDbContext, ApplicationDbContext>();
        services.AddScoped<IGFI, GFI>();
        return services;
    }
}
