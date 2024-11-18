using Learning.Domain.Models;
namespace Learning.Domain.Events.Courses;
public record CourseCreatedEvent(Course Course): IDomainEvent;