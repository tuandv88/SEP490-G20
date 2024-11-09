using AI.API.Hubs;
using AI.Application.Interfaces;
using BuildingBlocks.Exceptions.Handler;
using BuildingBlocks.Extensions;
using Carter;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using StackExchange.Redis;

namespace AI.API;
public static class DependencyInjection {
    public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration configuration) {
        services.AddCarter();

        //Authentication
        services.AddConfigureAuthentication(configuration, new JwtBearerOptions() {
            Events = new JwtBearerEvents {
                OnMessageReceived = context => {
                    var accessToken = context.Request.Query["access_token"];
                    var path = context.HttpContext.Request.Path;

                    if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/ai-chat")) {
                        context.Token = accessToken;
                    }
                    return Task.CompletedTask;
                }
            }
        });



        //SignalR
        services.AddSignalR(options => {
            options.HandshakeTimeout = TimeSpan.FromSeconds(15);
            options.KeepAliveInterval = TimeSpan.FromSeconds(10);
            options.ClientTimeoutInterval = TimeSpan.FromSeconds(30);
            options.MaximumReceiveMessageSize = 10485760; // 10MB thôi

            //Dùng cho môi trường phát triển
            options.EnableDetailedErrors = true;
        })
           .AddJsonProtocol(options => {
               options.PayloadSerializerOptions.PropertyNamingPolicy = null;
           })
          .AddStackExchangeRedis(configuration.GetConnectionString("Redis")!, options => {
              options.Configuration.ChannelPrefix = RedisChannel.Literal("AI-APP");

          });

        //ClientCommunicationService
        services.AddScoped<IClientCommunicationService, ClientCommunicationService>();

        //Config max size body
        //services.Configure<IISServerOptions>(options => {
        //    options.MaxRequestBodySize = 200 * 1024 * 1024; // 200MB
        //});

        services.Configure<KestrelServerOptions>(options =>
        {
            options.Limits.MaxRequestBodySize = 200 * 1024 * 1024; // 200MB
        });
        //Exceptions
        services.AddExceptionHandler<CustomExceptionHandler>();
        return services;
    }

    public static WebApplication UseApiServices(this WebApplication app) {
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapCarter();
        app.MapHub<ChatHub>("/ai-chat");
        app.UseExceptionHandler(options => { });
        return app;
    }
}

