using Community.API.Endpoints;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using StackExchange.Redis;

namespace Community.API;
public static class DependencyInjection
{
    public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddCarter();

        //Exceptions
        services.AddExceptionHandler<CustomExceptionHandler>();

        // Authentication
        services.AddConfigureAuthentication(configuration, new JwtBearerOptions()
        {
            Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    var accessToken = context.Request.Query["access_token"];
                    var path = context.HttpContext.Request.Path;

                    // Xác thực cho NotificationHub
                    if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/notificationhub"))
                    {
                        context.Token = accessToken;
                    }
                    return Task.CompletedTask;
                }
            }
        });

        services.AddSignalR(options =>
        {
            options.HandshakeTimeout = TimeSpan.FromSeconds(15);        // Thời gian chờ bắt tay kết nối
            options.KeepAliveInterval = TimeSpan.FromSeconds(10);       // Gửi tín hiệu giữ kết nối
            options.ClientTimeoutInterval = TimeSpan.FromSeconds(30);   // Thời gian chờ client
            options.MaximumReceiveMessageSize = 10485760;               // Giới hạn kích thước dữ liệu nhận (10MB)
            options.EnableDetailedErrors = true;                        // Kích hoạt thông báo lỗi chi tiết (dev mode)
        })
        .AddJsonProtocol(options =>
        {
            options.PayloadSerializerOptions.PropertyNamingPolicy = null; // Giữ nguyên định dạng tên thuộc tính
        })
        .AddStackExchangeRedis(configuration.GetConnectionString("Redis")!, options =>
        {
            options.Configuration.ChannelPrefix = RedisChannel.Literal("COMMUNITY-APP"); // Tiền tố kênh Redis
        });

        //services.AddScoped<INotificationService, NotificationService>();

        return services;
    }

    public static WebApplication UseApiServices(this WebApplication app)
    {
        app.UseAuthentication();
        app.UseAuthorization();

        // Map Carter endpoints
        app.MapCarter();

        // Map SignalR hubs
        //app.MapHub<NotificationHub>("/notificationhub");

        // Map custom seed data endpoint
        app.MapSeedDataEndpoint();

        app.UseExceptionHandler(options => { });
        return app;
    }
}

