namespace BuildingBlocks.Messaging.Events.Learnings.Chapters;
public record ChapterCreated(
    Guid Id, 
    DateTime OccurredAt, 
    Guid ChapterId,
    Guid CourseId,
    string Title,
    string Description,
    double TimeEstimation,
    int OrderIndex
) : ChapterEventBase(Id, OccurredAt, ChapterId) {
    public override string Type => nameof(ChapterCreated);
}

