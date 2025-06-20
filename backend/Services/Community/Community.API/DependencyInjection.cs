﻿using BuildingBlocks.Email.Helpers;
using BuildingBlocks.Email.Interfaces;
using BuildingBlocks.Email.Models;
using BuildingBlocks.Email.Services;
using Community.API.Endpoints;
using Community.API.Services;
using Community.Application.Interfaces;

namespace Community.API;
public static class DependencyInjection
{
    public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddCarter();

        //Exceptions
        services.AddExceptionHandler<CustomExceptionHandler>();

        //Authentication
        services.AddConfigureAuthentication(configuration);
        //services.AddScoped<INotificationService, NotificationService>();

        //UserContext
        services.AddScoped<IUserContextService, UserContextService>();

        //IdentityService
        services.AddScoped<IIdentityService, IdentityService>();

        //IEmailService
        //services.AddSingleton<EmailConfigurationHelper>();
        services.AddScoped<IEmailService, EmailService>();

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

