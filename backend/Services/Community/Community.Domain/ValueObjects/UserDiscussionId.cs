namespace Community.Domain.ValueObjects;
public record UserDiscussionId
{
    public UserDiscussionId(Guid value) => Value = value;
    public Guid Value { get; }
    public static UserDiscussionId Of(Guid value)
    {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty)
        {
            throw new DomainException("UserDiscussionId cannot be empty.");
        }
        return new UserDiscussionId(value);
    }
}