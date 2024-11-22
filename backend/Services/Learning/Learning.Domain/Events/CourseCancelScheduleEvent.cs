using Learning.Domain.Models;

namespace Learning.Domain.Events;
public record CourseCancelScheduleEvent(Course Course):IDomainEvent;

