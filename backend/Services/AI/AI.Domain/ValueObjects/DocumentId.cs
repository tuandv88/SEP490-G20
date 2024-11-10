using BuildingBlocks.Exceptions;

namespace AI.Domain.ValueObjects;
public record DocumentId {
    public DocumentId(Guid value) => Value = value;
    public Guid Value { get; }
    public static DocumentId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("DocumentId cannot be empty.");
        }
        return new DocumentId(value);
    }
}

