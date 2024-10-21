
namespace User.Domain.ValueObjects;

public record PathStepId
{
    public PathStepId(Guid value) => Value = value;
    public Guid Value { get; }

    public static PathStepId Of(Guid value)
    {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty)
        {
            throw new DomainException("PathStepId cannot be empty.");
        }
        return new PathStepId(value);
    }
}
