using Community.API.Endpoints;

namespace Community.API;
public static class DependencyInjection
{
    public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddCarter();

        //Authentication
        services.AddConfigureAuthentication(configuration);
        //Exceptions
        services.AddExceptionHandler<CustomExceptionHandler>();

        return services;
    }

    public static WebApplication UseApiServices(this WebApplication app)
    {
        app.UseAuthentication();
        app.UseAuthorization();  
        
        // Map Carter endpoints
        app.MapCarter();

        // Map custom seed data endpoint
        app.MapSeedDataEndpoint();
        
        app.UseExceptionHandler(options => { });
        return app;
    }
}

