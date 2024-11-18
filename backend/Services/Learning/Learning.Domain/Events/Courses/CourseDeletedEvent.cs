using Learning.Domain.Models;

namespace Learning.Domain.Events.Courses;
public record CourseDeletedEvent(Course Course) : IDomainEvent;

