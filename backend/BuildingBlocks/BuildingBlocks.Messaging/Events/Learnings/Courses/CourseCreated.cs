namespace BuildingBlocks.Messaging.Events.Learnings.Courses;
public record CourseCreated(
    Guid Id,
    DateTime OccurredAt,
    Guid CourseId,
    string Title,
    string Description,
    string Headline,
    double TimeEstimation,
    string Prerequisites,
    string Objectives,
    string TargetAudiences,
    string CourseLevel,
    double Price
) : CourseEventBase(Id, OccurredAt, CourseId) {
    public override string Type => nameof(CourseCreated);
}

