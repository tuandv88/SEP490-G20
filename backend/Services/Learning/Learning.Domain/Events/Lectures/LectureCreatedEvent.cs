using BuildingBlocks.Messaging.Events.Learnings;
using Learning.Domain.Models;

namespace Learning.Domain.Events.Lectures;
public record LectureCreatedEvent(Lecture Lecture) : IDomainEvent;

