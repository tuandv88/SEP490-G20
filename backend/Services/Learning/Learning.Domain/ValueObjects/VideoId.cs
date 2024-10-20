namespace Learning.Domain.ValueObjects;
public record VideoId {
    public VideoId(Guid value) => Value = value;
    public Guid Value { get; }
    public static VideoId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("VideoId cannot be empty.");
        }
        return new VideoId(value);
    }
}

