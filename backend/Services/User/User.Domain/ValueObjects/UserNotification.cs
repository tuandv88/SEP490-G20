
namespace User.Domain.ValueObjects;
public record UserNotificationId
{
    public UserNotificationId(Guid value) => Value = value;
    public Guid Value { get; }

    public static UserNotificationId Of(Guid value)
    {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty)
        {
            throw new DomainException("UserNotificationId cannot be empty.");
        }
        return new UserNotificationId(value);
    }
}
