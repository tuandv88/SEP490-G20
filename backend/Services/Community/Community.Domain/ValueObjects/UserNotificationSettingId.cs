namespace Community.Domain.ValueObjects;
public record UserNotificationSettingId
{
    public UserNotificationSettingId(Guid value) => Value = value;
    public Guid Value { get; }
    public static UserNotificationSettingId Of(Guid value)
    {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty)
        {
            throw new DomainException("UserNotificationSettingId cannot be empty.");
        }
        return new UserNotificationSettingId(value);
    }
}