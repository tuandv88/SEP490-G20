using User.Domain.Enums;

namespace User.Application.Models.PathSteps.Dtos
{
    public record CreatePathStepDto(
        Guid LearningPathId,
        Guid CourseId
    );

}