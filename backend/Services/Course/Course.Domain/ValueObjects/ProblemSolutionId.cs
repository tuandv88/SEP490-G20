namespace Course.Domain.ValueObjects;
public record ProblemSolutionId {
    private ProblemSolutionId(Guid value) => Value = value;
    public Guid Value { get; }
    public static ProblemSolutionId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("ProblemSolutionId cannot be empty.");
        }
        return new ProblemSolutionId(value);
    }
}

