namespace Community.Domain.ValueObjects;
public record CommentId
{
    public Guid Value { get; }
    public CommentId() { }
    public CommentId(Guid value) => Value = value;
    public static CommentId Of(Guid value)
    {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty)
        {
            throw new DomainException("CommentId cannot be empty.");
        }
        return new CommentId(value);
    }
}