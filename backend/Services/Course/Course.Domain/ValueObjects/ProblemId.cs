namespace Course.Domain.ValueObjects;
public class ProblemId {
    public ProblemId(Guid value) => Value = value;
    public Guid Value { get; }
    public static ProblemId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("ProblemId cannot be empty.");
        }
        return new ProblemId(value);
    }
}

