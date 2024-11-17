namespace BuildingBlocks.Messaging.Events.Learnings.Lectures;
public abstract record LectureEventBase(Guid Id, DateTime OccurredAt, Guid LectureId): EventBase(Id, OccurredAt);

