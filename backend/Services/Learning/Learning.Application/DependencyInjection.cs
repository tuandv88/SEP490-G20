﻿using BuildingBlocks.Behaviors;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace Learning.Application;
public static class DependencyInjection {
    public static IServiceCollection AddApplicationServices
    (this IServiceCollection services, IConfiguration configuration) {
        //CodeSandbox
        services.AddJudge0Dotnet(configuration);
        //MediatR
        services.AddMediatR(config => {
            config.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
            config.AddOpenBehavior(typeof(AuthorizationBehavior<,>));
            config.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        //Storage
        services.AddStorage(configuration);

        return services;
    }
}

