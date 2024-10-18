namespace Learning.Domain.ValueObjects;
public record ChapterId {
    private ChapterId(Guid value) => Value = value;
    public Guid Value { get; }
    public static ChapterId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("ChapterId cannot be empty.");
        }
        return new ChapterId(value);
    }
}

