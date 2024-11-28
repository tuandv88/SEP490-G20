using User.Application.Models.LearningPaths.Dtos;

namespace User.Application.Extensions;

    public static class LearningPathExtensions
    {
    public static LearningPathDto ToLearningPathDto(this LearningPath learningPath)
    {
        return new LearningPathDto(
            Id: learningPath.Id.Value,
            UserId : learningPath.UserId.Value,
            PathName: learningPath.PathName,
            StartDate: learningPath.StartDate,
            EndDate: learningPath.EndDate,
            Status: learningPath.Status,
            Reason: learningPath.Reason
            );
    }
    public static List<LearningPathDto> ToLearningPathDtoList(this List<LearningPath> learningPaths)
    {
        return learningPaths.Select(lp => lp.ToLearningPathDto()).ToList();
    }
}
