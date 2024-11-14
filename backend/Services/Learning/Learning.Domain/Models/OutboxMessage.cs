namespace Learning.Domain.Models;

public class OutboxMessage {
    public OutboxMessage(OutboxMessageId id, string payload, string aggregateId, string aggregateType, DateTime occurredAt, string type) {
        Id = id;
        Payload = payload;
        AggregateId = aggregateId;
        AggregateType = aggregateType;
        Timestamp = DateTime.SpecifyKind(occurredAt, DateTimeKind.Unspecified);
        Type = type;
    }
    public OutboxMessageId Id { get; } // event id

    public string Payload { get; } // data 

    public string AggregateId { get; } // Entity Id 

    public string AggregateType { get; } // Entity type : Course, Chapter,...

    public string Type { get; } // kiểu của event: CourseCreated, CourseUpdated,...

    public DateTime Timestamp { get; } 
}

