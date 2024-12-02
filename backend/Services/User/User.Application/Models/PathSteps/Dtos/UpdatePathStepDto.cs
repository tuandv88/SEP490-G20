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

    // DTO mới chứa mảng các PathSteps
    public class UpdatePathStepsRequestDto
    {
        public List<UpdatePathStepDto> PathSteps { get; set; }

        public UpdatePathStepsRequestDto(List<UpdatePathStepDto> pathSteps)
        {
            PathSteps = pathSteps;
        }
    }
}