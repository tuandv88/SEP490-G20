using User.Domain.Enums;

namespace User.Application.Models.LearningPaths.Dtos
{
    public record CreateLearningPathDto(
        string PathName,
        DateTime StartDate,
        DateTime EndDate,
        LearningPathStatus Status
    );
}
