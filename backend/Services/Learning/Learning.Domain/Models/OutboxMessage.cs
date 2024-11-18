using BuildingBlocks.Messaging.Events;

namespace Learning.Domain.Models;

public class OutboxMessage {
    public OutboxMessageId Id { get; init; } = default!; // event id

    public EventBase Payload { get; init; } = default!;// data 

    public string AggregateId { get; init; } = default!;// Entity Id 

    public string AggregateType { get; init; } = default!;// Entity type : Course, Chapter,...

    public string Type { get; init; } = default!;// kiểu của event: CourseCreated, CourseUpdated,...

    public DateTime Timestamp { get; init; } = default!;

    public OutboxMessage(EventBase payload, string aggregateId, string aggregateType) {
        Id = OutboxMessageId.Of(payload.Id);
        Payload = payload;
        AggregateId = aggregateId;
        AggregateType = aggregateType;
        Timestamp = DateTime.SpecifyKind(payload.OccurredAt, DateTimeKind.Unspecified);
        Type = payload.Type;
    }
}

