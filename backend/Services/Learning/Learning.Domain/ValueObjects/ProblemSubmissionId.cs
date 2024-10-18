namespace Learning.Domain.ValueObjects;
public record ProblemSubmissionId {
    private ProblemSubmissionId(Guid value) => Value = value;
    public Guid Value { get; }
    public static ProblemSubmissionId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("ProblemSubmissionId cannot be empty.");
        }
        return new ProblemSubmissionId(value);
    }

}

