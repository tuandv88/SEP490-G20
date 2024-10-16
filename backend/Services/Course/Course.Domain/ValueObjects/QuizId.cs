namespace Course.Domain.ValueObjects;
public record QuizId {
    private QuizId(Guid value) => Value = value;
    public Guid Value { get; }
    public static QuizId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("QuizId cannot be empty.");
        }
        return new QuizId(value);
    }
}

