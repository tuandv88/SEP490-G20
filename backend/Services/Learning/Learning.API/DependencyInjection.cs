using BuildingBlocks.Exceptions.Handler;
using BuildingBlocks.Extensions;
using Microsoft.AspNetCore.Server.Kestrel.Core;
namespace Learning.API;
public static class DependencyInjection {
    public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration configuration) {
        services.AddCarter();

        //Authentication
        services.AddConfigureAuthentication(configuration);
        //Exceptions
        services.AddExceptionHandler<CustomExceptionHandler>();

        services.Configure<KestrelServerOptions>(options => {
            options.Limits.MaxRequestBodySize = 5L * 1024 * 1024 * 1024; // 5GB
        });
        return services;
    }

    public static WebApplication UseApiServices(this WebApplication app) {
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapCarter();
        app.UseExceptionHandler(options => { });
        return app;
    }
}

