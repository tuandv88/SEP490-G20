namespace BuildingBlocks.Messaging.Events.Learnings.Lectures;
public record LectureUpdated(
    Guid Id,
    DateTime OccurredAt,
    Guid LectureId,
    Guid ChapterId,
    string Title,
    string Summary,
    double TimeEstimation,
    string LectureType,
    int OrderIndex,
    int Point
) : LectureEventBase(Id, OccurredAt, LectureId) {
    public override string Type => nameof(LectureUpdated);
}

