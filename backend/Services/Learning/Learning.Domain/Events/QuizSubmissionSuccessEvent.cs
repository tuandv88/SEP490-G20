namespace Learning.Domain.Events;

public record QuizSubmissionSuccessEvent(QuizId QuizId, QuizSubmissionStatus Status, UserId UserId) : IDomainEvent;