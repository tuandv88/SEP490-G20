using Learning.Domain.Models;

namespace Learning.Domain.Events.Lectures;
public record LectureDeletedEvent(Lecture Lecture) : IDomainEvent;
