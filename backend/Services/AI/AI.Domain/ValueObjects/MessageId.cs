using BuildingBlocks.Exceptions;

namespace AI.Domain.ValueObjects;
public record MessageId {
    public MessageId(Guid value) => Value = value;
    public Guid Value { get; }
    public static MessageId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("MessageId cannot be empty.");
        }
        return new MessageId(value);
    }
}

