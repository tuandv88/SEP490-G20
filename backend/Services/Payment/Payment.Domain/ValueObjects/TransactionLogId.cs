namespace Payment.Domain.ValueObjects;
public class TransactionLogId {
    public TransactionLogId(Guid value) => Value = value;
    public Guid Value { get; }
    public static TransactionLogId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("TransactionLogId cannot be empty.");
        }
        return new TransactionLogId(value);
    }
}

