namespace BuildingBlocks.Messaging.Events.Learnings;
public record QuizSubmissionEvent(Guid SubmissionId) : IntegrationEvent;