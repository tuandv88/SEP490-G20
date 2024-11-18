using MassTransit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AI.Infrastructure.Extensions;
internal static class MassTransitConfigurationExtensions {
    public static void AddMassTransitWithKafka(this IServiceCollection services, IConfiguration configuration) {
        services.AddMassTransit(x => {
            //x.AddConsumer<KafkaMessageConsumer2>();

            //x.UsingInMemory((context, cfg) => {
            //    cfg.ConfigureEndpoints(context);
            //});

            x.AddRider(rider => {
                //rider.AddConsumer<KafkaMessageConsumer2>();
                var endpoint = configuration["MessageBroker:Host"];
                rider.UsingKafka((context, k) => {
                    k.Host(endpoint);

                    //k.TopicEndpoint<KafkaMessage>(
                    //    "source.public.factinternetsales_streaming",
                    //    "sales-transactions", e => {
                    //        e.ConfigureConsumer<KafkaMessageConsumer2>(context);
                    //    });
                });
            });
        });
    }
}

