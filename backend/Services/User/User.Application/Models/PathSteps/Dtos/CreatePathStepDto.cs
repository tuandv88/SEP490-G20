using User.Domain.Enums;

namespace User.Application.Models.PathSteps.Dtos
{
    public record CreatePathStepDto(
        Guid LearningPathId,
        Guid CourseId,
        int StepOrder,
        PathStepStatus Status, // Có thể map với enum Status nếu có
        DateTime? EnrollmentDate,
        DateTime? CompletionDate,
        DateTime ExpectedCompletionDate

    );

}