namespace BuildingBlocks.Messaging.Events.Learnings.Chapters;
public record ChapterDeleted(
    Guid Id, 
    DateTime OccurredAt,
    Guid ChapterId
) : ChapterEventBase(Id, OccurredAt, ChapterId) {
    public override string Type => nameof(ChapterDeleted);
}

