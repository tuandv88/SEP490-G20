namespace Payment.Domain.ValueObjects;
public class TransactionId {
    public TransactionId(Guid value) => Value = value;
    public Guid Value { get; }
    public static TransactionId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("TransactionId cannot be empty.");
        }
        return new TransactionId(value);
    }
}

