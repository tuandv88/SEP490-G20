namespace Learning.Domain.ValueObjects;
public record TestScriptId {
    private TestScriptId(Guid value) => Value = value;
    public Guid Value { get; }
    public static TestScriptId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("TestScriptId cannot be empty.");
        }
        return new TestScriptId(value);
    }
}

