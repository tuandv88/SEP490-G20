namespace BuildingBlocks.Messaging.Events.Learnings.Chapters;
public abstract record ChapterEventBase(Guid Id, DateTime OccurredAt, Guid ChapterId) : EventBase(Id, OccurredAt);

