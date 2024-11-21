using Learning.Domain.Models;

namespace Learning.Domain.Events;
public record QuizSubmissionUpdateStatusEvent(QuizSubmission QuizSubmission): IDomainEvent;

