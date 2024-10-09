namespace Course.Domain.ValueObjects;
public class ChapterId {
    public ChapterId(Guid value) => Value = value;
    public Guid Value { get; }
    public static ChapterId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("ChapterId cannot be empty.");
        }
        return new ChapterId(value);
    }
}

