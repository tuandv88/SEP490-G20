namespace Course.Domain.ValueObjects;
public class ProblemTestCaseId {
    public ProblemTestCaseId(Guid value) => Value = value;
    public Guid Value { get; }
    public static ProblemTestCaseId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("ProblemTestCaseId cannot be empty.");
        }
        return new ProblemTestCaseId(value);
    }
}

