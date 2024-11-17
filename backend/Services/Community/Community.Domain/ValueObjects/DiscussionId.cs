namespace Community.Domain.ValueObjects;
public record DiscussionId
{
    public Guid Value { get; }
    public DiscussionId(Guid value) => Value = value;
    public static DiscussionId Of(Guid value)
    {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty)
        {
            throw new DomainException("DiscussionId cannot be empty.");
        }
        return new DiscussionId(value);
    }
}