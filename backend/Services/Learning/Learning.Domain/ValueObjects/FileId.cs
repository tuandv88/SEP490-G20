namespace Learning.Domain.ValueObjects;
public record FileId {
    public FileId(Guid value) => Value = value;
    public Guid Value { get; }
    public static FileId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("FileId cannot be empty.");
        }
        return new FileId(value);
    }
}

