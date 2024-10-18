namespace Learning.Domain.ValueObjects;
public record LectureProgressId {
    private LectureProgressId(Guid value) => Value = value;
    public Guid Value { get; }
    public static LectureProgressId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("LectureProgressId cannot be empty.");
        }
        return new LectureProgressId(value);
    }
}

