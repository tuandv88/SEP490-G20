using BuildingBlocks.Exceptions.Handler;
using BuildingBlocks.Extensions;
namespace Course.API;
public static class DependencyInjection {
    public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration configuration) {
        services.AddCarter();

        //Authentication
        services.ConfigureAuthentication(configuration);
        //Caching
        services.ConfigureCaching(configuration);
        //Exceptions
        services.AddExceptionHandler<CustomExceptionHandler>();

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

