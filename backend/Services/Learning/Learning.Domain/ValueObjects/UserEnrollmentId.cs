namespace Learning.Domain.ValueObjects;
public record UserEnrollmentId {
    public UserEnrollmentId(Guid value) => Value = value;
    public Guid Value { get; }
    public static UserEnrollmentId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("UserEnrollmentId cannot be empty.");
        }
        return new UserEnrollmentId(value);
    }
}

