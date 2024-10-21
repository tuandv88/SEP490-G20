
namespace User.Domain.ValueObjects;

public record NotificationTypeId
{
    public NotificationTypeId(Guid value) => Value = value;
    public Guid Value { get; }

    public static NotificationTypeId Of(Guid value)
    {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty)
        {
            throw new DomainException("NotificationTypeId cannot be empty.");
        }
        return new NotificationTypeId(value);
    }
}
