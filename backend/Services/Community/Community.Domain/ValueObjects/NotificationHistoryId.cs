namespace Community.Domain.ValueObjects;
public record NotificationHistoryId
{
    public NotificationHistoryId(Guid value) => Value = value;
    public NotificationHistoryId() { }
    public Guid Value { get; }
    public static NotificationHistoryId Of(Guid value)
    {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty)
        {
            throw new DomainException("NotificationHistoryId cannot be empty.");
        }
        return new NotificationHistoryId(value);
    }
}