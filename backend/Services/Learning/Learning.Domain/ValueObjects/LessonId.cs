namespace Learning.Domain.ValueObjects;
public record LessonId {
    private LessonId(Guid value) => Value = value;
    public Guid Value { get; }
    public static LessonId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("LessonId cannot be empty.");
        }
        return new LessonId(value);
    }
}

