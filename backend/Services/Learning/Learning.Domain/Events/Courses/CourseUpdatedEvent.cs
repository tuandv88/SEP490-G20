using Learning.Domain.Models;

namespace Learning.Domain.Events.Courses;
public record CourseUpdatedEvent(Course Course) : IDomainEvent;