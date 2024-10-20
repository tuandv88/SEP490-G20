namespace Learning.Domain.ValueObjects;
public record LectureCommentId {
    public LectureCommentId(Guid value) => Value = value;
    public Guid Value { get; }
    public static LectureCommentId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("LectureCommentId cannot be empty.");
        }
        return new LectureCommentId(value);
    }
}

