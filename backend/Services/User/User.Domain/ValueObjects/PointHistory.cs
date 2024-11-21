
namespace User.Domain.ValueObjects;

public record PointHistoryId
{
    public PointHistoryId(Guid value) => Value = value;
    public Guid Value { get; }

    public static PointHistoryId Of(Guid value)
    {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty)
        {
            throw new DomainException("PointHistoryId cannot be empty.");
        }
        return new PointHistoryId(value);
    }
}
