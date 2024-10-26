namespace Learning.Application.Models.ProblemSolutions.Dtos;
public record ProblemSolutionDetailsDto(
    Guid Id,
    string FileName,
    string SolutionCode,
    string Description,
    string LanguageCode,
    bool Priority = false
);

