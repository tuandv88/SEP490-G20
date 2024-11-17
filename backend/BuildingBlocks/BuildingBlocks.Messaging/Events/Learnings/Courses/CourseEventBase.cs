namespace BuildingBlocks.Messaging.Events.Learnings.Courses;
public abstract record CourseEventBase(Guid Id, DateTime OccurredAt, Guid CourseId) : EventBase(Id, OccurredAt);

