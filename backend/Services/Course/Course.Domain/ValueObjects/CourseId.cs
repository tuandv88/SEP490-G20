namespace Course.Domain.ValueObjects;
public class CourseId {
    public CourseId(Guid value)=> Value = value;
    public Guid Value { get; }
    public static CourseId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("CourseId cannot be empty.");
        }
        return new CourseId(value);
    }
}

