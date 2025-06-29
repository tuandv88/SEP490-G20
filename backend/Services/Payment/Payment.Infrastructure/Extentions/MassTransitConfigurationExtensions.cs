﻿using MassTransit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using Payment.Infrastructure.Data;
using Payment.Application.Sagas;
using System;
namespace Payment.Infrastructure.Extentions;
public static class MassTransitConfigurationExtensions {
    public static void AddMassTransitWithRabbitMQ(this IServiceCollection services, IConfiguration configuration, Assembly? assembly = null) {
        services.AddMassTransit(x => {
            x.SetKebabCaseEndpointNameFormatter();
            if (assembly != null)
                x.AddConsumers(assembly);

            x.AddSagaStateMachine<PaymentSagaStateMachine, PaymentSagaInstance>()
            .EntityFrameworkRepository(r =>{
                r.ExistingDbContext<ApplicationDbContext>();
                r.UsePostgres();
            });
            x.AddEntityFrameworkOutbox<ApplicationDbContext>(o => {
                o.UsePostgres();
                o.UseBusOutbox();
                o.DuplicateDetectionWindow = TimeSpan.FromSeconds(30);
                o.DisableInboxCleanupService();
            });


            x.UsingRabbitMq((context, configurator) => {

                configurator.Host(new Uri(configuration["MessageBroker:Host"]!), host => {
                    host.Username(configuration["MessageBroker:UserName"]!);
                    host.Password(configuration["MessageBroker:Password"]!);
                });
                configurator.ConfigureEndpoints(context);
                configurator.UseMessageRetry(r => {
                    r.Interval(10, TimeSpan.FromSeconds(2));
                });

            });
        });
    }
}

