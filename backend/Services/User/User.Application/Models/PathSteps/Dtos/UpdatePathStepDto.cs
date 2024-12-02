using User.Domain.Enums;

namespace User.Application.Models.PathSteps.Dtos
{
    public record UpdatePathStepDto(
        Guid Id,
        Guid CourseId,
        int StepOrder,
        PathStepStatus Status,
        DateTime EnrollmentDate,
        DateTime? CompletionDate,
        DateTime ExpectedCompletionDate
    );
}
