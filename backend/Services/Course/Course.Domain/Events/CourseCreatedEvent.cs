namespace Course.Domain.Events;
public record CourseCreatedEvent(Models.Course Course) : IDomainEvent;
