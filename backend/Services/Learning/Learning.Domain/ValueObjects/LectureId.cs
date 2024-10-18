namespace Learning.Domain.ValueObjects;
public record LectureId {
    private LectureId(Guid value) => Value = value;
    public Guid Value { get; }
    public static LectureId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("LectureId cannot be empty.");
        }
        return new LectureId(value);
    }
}

