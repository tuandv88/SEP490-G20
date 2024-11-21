namespace Learning.Domain.Events;
public record CourseScheduledEvent(Guid CourseId) : IDomainEvent;

