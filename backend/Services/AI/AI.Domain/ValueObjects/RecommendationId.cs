using BuildingBlocks.Exceptions;

namespace AI.Domain.ValueObjects;
public record RecommendationId {
    public RecommendationId(Guid value) => Value = value;
    public Guid Value { get; }
    public static RecommendationId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("RecommendationId cannot be empty.");
        }
        return new RecommendationId(value);
    }
}

