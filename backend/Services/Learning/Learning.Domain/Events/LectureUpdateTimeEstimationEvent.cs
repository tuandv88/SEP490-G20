using Learning.Domain.Models;

namespace Learning.Domain.Events;
public record LectureUpdateTimeEstimationEvent(CourseId CourseId) : IDomainEvent;

