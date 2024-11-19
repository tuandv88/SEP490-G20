namespace BuildingBlocks.Messaging.Events.Learnings;
public record CourseRevokedEvent(Guid CourseId) : IntegrationEvent;

