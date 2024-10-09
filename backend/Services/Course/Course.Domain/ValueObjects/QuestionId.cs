namespace Course.Domain.ValueObjects;
public class QuestionId {
    public QuestionId(Guid value) => Value = value;
    public Guid Value { get; }
    public static QuestionId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("QuestionId cannot be empty.");
        }
        return new QuestionId(value);
    }
}

