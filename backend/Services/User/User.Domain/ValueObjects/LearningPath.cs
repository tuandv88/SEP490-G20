
namespace User.Domain.ValueObjects;

public record LearningPathId
{
    public LearningPathId(Guid value) => Value = value;
    public Guid Value { get; }

    public static LearningPathId Of(Guid value)
    {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty)
        {
            throw new DomainException("LearningPathId cannot be empty.");
        }
        return new LearningPathId(value);
    }
}
