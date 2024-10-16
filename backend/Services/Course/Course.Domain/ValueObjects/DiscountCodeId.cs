namespace Course.Domain.ValueObjects;
public record DiscountCodeId {
    private DiscountCodeId(Guid value) => Value = value;
    public Guid Value { get; }
    public static DiscountCodeId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("DiscountCodeId cannot be empty.");
        }
        return new DiscountCodeId(value);
    }
}

