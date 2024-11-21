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

        services.AddSignalR(options =>
        {
            options.HandshakeTimeout = TimeSpan.FromSeconds(15); // Thời gian chờ bắt tay kết nối
            options.KeepAliveInterval = TimeSpan.FromSeconds(10); // Gửi tín hiệu giữ kết nối
            options.ClientTimeoutInterval = TimeSpan.FromSeconds(30); // Thời gian chờ client
            options.MaximumReceiveMessageSize = 10485760; // Giới hạn kích thước dữ liệu nhận (10MB)
            options.EnableDetailedErrors = true; // Kích hoạt thông báo lỗi chi tiết (dev mode)
        })
        .AddJsonProtocol(options =>
        {
            options.PayloadSerializerOptions.PropertyNamingPolicy = null; // Giữ nguyên định dạng tên thuộc tính
        })
        .AddStackExchangeRedis(configuration.GetConnectionString("Redis")!, options =>
        {
            options.Configuration.ChannelPrefix = "Community-Notification"; // Tiền tố kênh Redis
        });

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

