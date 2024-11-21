using Learning.Domain.Models;

namespace Learning.Domain.Events;
public record CourseUpdatedStatusEvent(Course Course) : IDomainEvent;

