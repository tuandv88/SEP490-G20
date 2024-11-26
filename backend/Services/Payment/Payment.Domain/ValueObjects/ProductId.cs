namespace Payment.Domain.ValueObjects;
public class ProductId {
    public ProductId(Guid value) => Value = value;
    public Guid Value { get; }
    public static ProductId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("ProductId cannot be empty.");
        }
        return new ProductId(value);
    }
}

