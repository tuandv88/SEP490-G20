using Learning.Domain.Models;

namespace Learning.Domain.Events;
public record LectureCompletedEvent(LectureProgress LectureProgress) : IDomainEvent;

