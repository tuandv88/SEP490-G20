
namespace User.Domain.ValueObjects;
public record UserGoalId
{
    public UserGoalId(Guid value) => Value = value;
    public Guid Value { get; }

    public static UserGoalId Of(Guid value)
    {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty)
        {
            throw new DomainException("UserGoalId cannot be empty.");
        }
        return new UserGoalId(value);
    }
}
