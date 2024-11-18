namespace BuildingBlocks.Messaging.Events.Learnings.Lectures;
public record LectureDeleted(
    Guid Id, 
    DateTime OccurredAt, 
    Guid LectureId
) : LectureEventBase(Id, OccurredAt, LectureId) {
    public override string Type => nameof(LectureDeleted);
}

