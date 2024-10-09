using BuildingBlocks.Exceptions;

namespace BuildingBlocks.ValueObjects;
public class UserAssessmentId {
    public UserAssessmentId(Guid value) => Value = value;
    public Guid Value { get; }
    public static UserAssessmentId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("UserAssessmentId cannot be empty.");
        }
        return new UserAssessmentId(value);
    }
}

