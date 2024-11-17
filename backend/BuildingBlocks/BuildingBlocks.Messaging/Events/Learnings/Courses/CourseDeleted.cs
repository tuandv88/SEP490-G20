namespace BuildingBlocks.Messaging.Events.Learnings.Courses;
public record CourseDeleted(
    Guid Id,
    DateTime OccurredAt,
    Guid CourseId
) : CourseEventBase(Id, OccurredAt, CourseId) {
    public override string Type => nameof(CourseDeleted);
}

