using Learning.Domain.Models;

namespace Learning.Domain.Events.Lectures;
public record LectureUpdatedEvent(Lecture Lecture) : IDomainEvent;

