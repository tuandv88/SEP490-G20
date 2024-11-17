using AI.Application.Events.Learnings;
using BuildingBlocks.Messaging.Events.Learnings.Chapters;
using BuildingBlocks.Messaging.Events.Learnings.Courses;
using BuildingBlocks.Messaging.Events.Learnings.Lectures;
using Confluent.Kafka;
using MassTransit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AI.Infrastructure.Extensions.Kafkas;
internal static class MassTransitConfigurationExtensions {
    public static void AddMassTransitWithKafka(this IServiceCollection services, IConfiguration configuration) {
        services.AddMassTransit(x => {
            //không dùng cái này
            x.UsingInMemory();

            x.AddRider(rider => {
                rider.AddConsumer<CourseEventConsumer>();
                rider.AddConsumer<ChapterEventConsumer>();
                rider.AddConsumer<LectureEventConsumer>();

                var endpoint = configuration["MessageBroker:Host"];
                rider.UsingKafka((context, cfg) => {
                    //config endpoint
                    cfg.Host(endpoint);

                    //config endpoint course event
                    cfg.TopicEndpoint<string, CourseEventBase>("Course.events", "Sync.AI.events", e => {
                        e.AutoOffsetReset = AutoOffsetReset.Earliest;
                        e.SetKeyDeserializer(Deserializers.Utf8);
                        e.SetValueDeserializer(new JsonEventSerializer<CourseEventBase>());
                        e.UseRetryConfiguration();
                        e.ConfigureConsumer<CourseEventConsumer>(context);
                        e.ConcurrentMessageLimit = 3; // số message xử lí đồng thời (mỗi message 1 thread)
                        e.ConcurrentConsumerLimit = 2; // số consumer được tạo ra
                        e.ConcurrentDeliveryLimit = 1; // các message phải được xử lí tuần tự từng cái một
                    });

                    ////config endpoint chapter event
                    cfg.TopicEndpoint<string, ChapterEventBase>("Chapter.events", "Sync.AI.events", e => {
                        e.AutoOffsetReset = AutoOffsetReset.Earliest;
                        e.SetKeyDeserializer(Deserializers.Utf8);
                        e.SetValueDeserializer(new JsonEventSerializer<ChapterEventBase>());
                        e.UseRetryConfiguration();
                        e.ConfigureConsumer<ChapterEventConsumer>(context);
                        e.ConcurrentMessageLimit = 3;
                        e.ConcurrentConsumerLimit = 2;
                        e.ConcurrentDeliveryLimit = 1;
                    });

                    //config endpoit lecture event
                    cfg.TopicEndpoint<string, LectureEventBase>("Lecture.events", "Sync.AI.events", e => {
                        e.AutoOffsetReset = AutoOffsetReset.Earliest;
                        e.SetKeyDeserializer(Deserializers.Utf8);
                        e.SetValueDeserializer(new JsonEventSerializer<LectureEventBase>());
                        e.UseRetryConfiguration();
                        e.ConfigureConsumer<LectureEventConsumer>(context);
                        e.ConcurrentMessageLimit = 3;
                        e.ConcurrentConsumerLimit = 2;
                        e.ConcurrentDeliveryLimit = 3;
                    });
                });
            });
        });
    }
    private static void UseRetryConfiguration(this IKafkaTopicReceiveEndpointConfigurator configurator) {
        configurator.UseKillSwitch(k =>
        k.SetActivationThreshold(2) // Số lượng lỗi tối thiểu để kích hoạt KillSwitch
        .SetRestartTimeout(m: 1) // Thời gian chờ trước khi consumer được khởi động lại
        .SetTripThreshold(0.1) // Ngưỡng tỷ lệ lỗi (10%) để kích hoạt KillSwitch
        .SetTrackingPeriod(m: 1)); // Khoảng thời gian để theo dõi tỷ lệ lỗi

        configurator.UseMessageRetry(retry =>
        retry.Interval(10, TimeSpan.FromSeconds(5)));
    }
}

