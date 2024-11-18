using BuildingBlocks.Behaviors;
using BuildingBlocks.Messaging.MassTransit;
using FluentValidation;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace AI.Application;
public static class DependencyInjection {
    public static IServiceCollection AddApplicationServices (this IServiceCollection services, IConfiguration configuration) {
        //MediatR
        services.AddMediatR(config => {
            config.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
            config.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        //RabbitMQ
        //services.AddMessageBroker(configuration, Assembly.GetExecutingAssembly());

        return services;
    }
}

