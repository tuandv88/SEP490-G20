using User.Domain.Enums;

namespace User.Application.Models.LearningPaths.Dtos
{
    public record UpdateLearningPathDto(
        Guid Id,
        Guid UserId,
        string PathName,
        DateTime StartDate,
        DateTime EndDate,
        LearningPathStatus Status
    );
}
