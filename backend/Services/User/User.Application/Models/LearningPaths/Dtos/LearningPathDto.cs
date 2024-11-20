using Judge0.DotNet.Models.Statues;
using User.Application.Models.PathSteps.Dtos;
using User.Domain.Enums;

namespace User.Application.Models.LearningPaths.Dtos
{
    public record LearningPathDto(
        Guid Id,
        Guid UserId,
        string PathName,
        DateTime StartDate,
        DateTime EndDate,
        LearningPathStatus Status
    );
    public record LearningPathWithPathStepsDto(
         Guid Id,
         Guid UserId,
         string PathName,
         DateTime StartDate,
         DateTime EndDate,
         string Status,
         List<PathStepDto> PathSteps
        );

}
