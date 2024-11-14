namespace Learning.Domain.Events.Courses;
public record CourseCreatedEvent(Models.Course Course) : IDomainEvent;
