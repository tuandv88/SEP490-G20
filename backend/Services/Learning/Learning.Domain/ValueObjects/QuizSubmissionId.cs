namespace Learning.Domain.ValueObjects;
public record QuizSubmissionId {
    private QuizSubmissionId(Guid value) => Value = value;
    public Guid Value { get; }
    public static QuizSubmissionId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("QuizSubmissionId cannot be empty.");
        }
        return new QuizSubmissionId(value);
    }
}

