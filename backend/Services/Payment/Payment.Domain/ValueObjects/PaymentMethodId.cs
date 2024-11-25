
namespace Payment.Domain.ValueObjects;
public class PaymentMethodId {
    public PaymentMethodId(Guid value) => Value = value;
    public Guid Value { get; }
    public static PaymentMethodId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("PaymentMethodId cannot be empty.");
        }
        return new PaymentMethodId(value);
    }
}

