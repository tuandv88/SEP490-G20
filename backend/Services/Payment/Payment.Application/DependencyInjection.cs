using BuildingBlocks.Behaviors;
using FluentValidation;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Payment.Application.Commons;
using System.Reflection;

namespace Payment.Application;
public static class DependencyInjection {
    public static IServiceCollection AddApplicationServices (this IServiceCollection services, IConfiguration configuration) {

        services.AddMediatR(config => {
            config.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
            config.AddOpenBehavior(typeof(AuthorizationBehavior<,>));
            config.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        return services;
    }
}
