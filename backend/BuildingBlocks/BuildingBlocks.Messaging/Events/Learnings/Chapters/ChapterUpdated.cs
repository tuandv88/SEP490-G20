namespace BuildingBlocks.Messaging.Events.Learnings.Chapters;
public record ChapterUpdated(
    Guid Id,
    DateTime OccurredAt,
    Guid ChapterId,
    Guid CourseId,
    string Title,
    string Description,
    double TimeEstimation
) : ChapterEventBase(Id, OccurredAt, ChapterId) {
    public override string Type => nameof(ChapterUpdated);
}

