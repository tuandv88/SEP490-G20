namespace Learning.Domain.ValueObjects;
public record UserCourseId {
    private UserCourseId(Guid value) => Value = value;
    public Guid Value { get; }
    public static UserCourseId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("UserCourseId cannot be empty.");
        }
        return new UserCourseId(value);
    }
}

