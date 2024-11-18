namespace Learning.Domain.ValueObjects;
public record OutboxMessageId {
    public OutboxMessageId(Guid value) => Value = value;
    public Guid Value { get; }
    public static OutboxMessageId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("OutboxMessageId cannot be empty.");
        }
        return new OutboxMessageId(value);
    }
}

