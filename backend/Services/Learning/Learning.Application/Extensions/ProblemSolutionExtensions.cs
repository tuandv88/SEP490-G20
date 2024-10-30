using Learning.Application.Models.ProblemSolutions.Dtos;

namespace Learning.Application.Extensions;
public static class ProblemSolutionExtensions {
    public static ProblemSolutionDetailsDto ToProblemSolutionDetailsDto(this ProblemSolution problemSolution) {
        return new ProblemSolutionDetailsDto(
            Id: problemSolution.Id.Value,
            FileName: problemSolution.FileName,
            SolutionCode: problemSolution.SolutionCode,
            Description: problemSolution.Description,
            LanguageCode: problemSolution.LanguageCode.ToString(),
            Priority: problemSolution.Priority
            );
    }

    public static List<ProblemSolutionDetailsDto> ToListProblemSolutionDetailsDto( this List<ProblemSolution> problemSolutions) {
        return problemSolutions.Select( p => p.ToProblemSolutionDetailsDto() ).ToList();
    }
}

