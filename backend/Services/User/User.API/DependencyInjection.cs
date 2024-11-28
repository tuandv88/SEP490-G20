using BuildingBlocks.Exceptions.Handler;
using BuildingBlocks.Extensions;
using User.API.Services;
using User.Application.Interfaces;
namespace User.API;
public static class DependencyInjection
{
    public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddCarter();

        //Authentication
        services.AddConfigureAuthentication(configuration);
        //UserContext
        services.AddScoped<IUserContextService, UserContextService>();

        //IdentityService
        services.AddScoped<IIdentityService, IdentityService>();
        //Exceptions
        services.AddExceptionHandler<CustomExceptionHandler>();

        return services;
    }

    public static WebApplication UseApiServices(this WebApplication app)
    {
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapCarter();
        app.UseExceptionHandler(options => { });
        return app;
    }
}

