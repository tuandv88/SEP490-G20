namespace Learning.Application.Models.ProblemSolutions.Dtos;
public record UpdateProblemSolutionDto(
    Guid? Id,
    string FileName,
    string SolutionCode,
    string Description,
    string LanguageCode,
    bool Priority = false
);

