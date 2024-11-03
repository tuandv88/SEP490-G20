using BuildingBlocks.Exceptions;

namespace AI.Domain.ValueObjects;
public record ConversationId {
    public ConversationId(Guid value) => Value = value;
    public Guid Value { get; }
    public static ConversationId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("ConversationId cannot be empty.");
        }
        return new ConversationId(value);
    }
}

