using Learning.Domain.Models;

namespace Learning.Domain.Events;

public record QuizSubmissionSuccessEvent(QuizSubmission QuizSubmission) : IDomainEvent;