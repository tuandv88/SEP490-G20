using MassTransit;
using System.Reflection;

namespace Learning.Infrastructure.Extentions;
public static class MassTransitConfigurationExtensions {
    public static void AddMassTransitWithRabbitMQ(this IServiceCollection services, IConfiguration configuration, Assembly? assembly = null) {
        services.AddMassTransit(x => {
            x.SetKebabCaseEndpointNameFormatter();
            if (assembly != null)
                x.AddConsumers(assembly);
            //Thêm hangfire
            x.AddPublishMessageScheduler();
            x.AddHangfireConsumers();

            x.AddEntityFrameworkOutbox<ApplicationDbContext>(o => {
                //o.QueryDelay = TimeSpan.FromSeconds(5);
                //o.QueryMessageLimit = 10;
                //o.QueryTimeout = TimeSpan.FromSeconds(30);
                o.UsePostgres();
                o.UseBusOutbox();
                o.DuplicateDetectionWindow = TimeSpan.FromSeconds(30);
                o.DisableInboxCleanupService(); // không xóa những message gửi tới tránh duplicate dữ liệu
            });


            x.UsingRabbitMq((context, configurator) => {
                configurator.UsePublishMessageScheduler();

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

