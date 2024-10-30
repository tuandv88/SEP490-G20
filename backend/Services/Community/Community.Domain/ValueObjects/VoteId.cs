namespace Community.Domain.ValueObjects;
public record VoteId
{
    public VoteId(Guid value) => Value = value;
    public Guid Value { get; }
    public static VoteId Of(Guid value)
    {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty)
        {
            throw new DomainException("VoteId cannot be empty.");
        }
        return new VoteId(value);
    }
}
