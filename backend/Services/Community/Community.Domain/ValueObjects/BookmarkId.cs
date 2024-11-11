namespace Community.Domain.ValueObjects;
public record BookmarkId
{
    public Guid Value { get; }
    public BookmarkId() { }
    public BookmarkId(Guid value) => Value = value;
    public static BookmarkId Of(Guid value)
    {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty)
        {
            throw new DomainException("BookmarkId cannot be empty.");
        }
        return new BookmarkId(value);
    }
}