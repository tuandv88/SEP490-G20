namespace Course.Domain.ValueObjects;
public class QuestionOptionId {
    public QuestionOptionId(Guid value) => Value = value;
    public Guid Value { get; }
    public static QuestionOptionId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("QuestionOptionId cannot be empty.");
        }
        return new QuestionOptionId(value);
    }
}


