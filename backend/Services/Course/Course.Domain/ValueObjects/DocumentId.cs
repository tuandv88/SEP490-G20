namespace Course.Domain.ValueObjects;
public record DocumentId {
    private DocumentId(Guid value) => Value = value;
    public Guid Value { get; }
    public static DocumentId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("DocumentId cannot be empty.");
        }
        return new DocumentId(value);
    }
}

