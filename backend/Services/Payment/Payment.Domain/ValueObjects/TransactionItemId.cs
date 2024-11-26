namespace Payment.Domain.ValueObjects;
public class TransactionItemId {
    public TransactionItemId(Guid value) => Value = value;
    public Guid Value { get; }
    public static TransactionItemId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("TransactionItemId cannot be empty.");
        }
        return new TransactionItemId(value);
    }
}

