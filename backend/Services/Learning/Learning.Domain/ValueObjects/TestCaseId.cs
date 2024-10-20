namespace Learning.Domain.ValueObjects;
public record TestCaseId {
    public TestCaseId(Guid value) => Value = value;
    public Guid Value { get; }
    public static TestCaseId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("TestCaseId cannot be empty.");
        }
        return new TestCaseId(value);
    }
}

