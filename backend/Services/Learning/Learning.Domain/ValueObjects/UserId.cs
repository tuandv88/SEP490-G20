namespace Learning.Domain.ValueObjects;
public record UserId {
    public UserId(Guid value) => Value = value;
    public Guid Value { get; }
    public static UserId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("UserId cannot be empty.");
        }
        return new UserId(value);
    }
}

