namespace Community.Domain.ValueObjects;
public record CategoryId
{
    public CategoryId(Guid value) => Value = value;
    public Guid Value { get; }
    public static CategoryId Of(Guid value)
    {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty)
        {
            throw new DomainException("CategoryId cannot be empty.");
        }
        return new CategoryId(value);
    }
}