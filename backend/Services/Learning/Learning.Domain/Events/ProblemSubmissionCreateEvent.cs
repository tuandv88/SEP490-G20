namespace Learning.Domain.Events;

public record ProblemSubmissionCreateEvent(ProblemId ProblemId, UserId UserId, SubmissionStatus Status) : IDomainEvent;