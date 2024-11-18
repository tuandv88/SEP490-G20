namespace BuildingBlocks.Messaging.Events.Learnings.Lectures;
public record LectureCreated(
    Guid Id, 
    DateTime OccurredAt, 
    Guid LectureId,
    Guid ChapterId,
    string Title,
    string Summary,
    double TimeEstimation,
    string LectureType,
    int Point
) : LectureEventBase(Id, OccurredAt, LectureId) {
    public override string Type => nameof(LectureCreated);
}

