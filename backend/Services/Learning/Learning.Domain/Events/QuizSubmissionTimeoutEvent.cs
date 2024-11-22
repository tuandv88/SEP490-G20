namespace Learning.Domain.Events;
public record QuizSubmissionTimeoutEvent(Guid QuizSubmissionId) : IDomainEvent;

