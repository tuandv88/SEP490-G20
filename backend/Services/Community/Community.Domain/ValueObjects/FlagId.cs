namespace Community.Domain.ValueObjects;

public record FlagId
{
    public Guid Value { get; }
    public FlagId(Guid value) => Value = value;
    public static FlagId Of(Guid value)
    {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty)
        {
            throw new DomainException("FlagId cannot be empty.");
        }
        return new FlagId(value);
    }
}
