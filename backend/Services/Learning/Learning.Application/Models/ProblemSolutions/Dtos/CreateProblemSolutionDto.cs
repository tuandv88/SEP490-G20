namespace Learning.Application.Models.ProblemSolutions.Dtos;
public record CreateProblemSolutionDto(
    string FileName,
    string SolutionCode,
    string Description,
    string LanguageCode,
    bool Priority = false
); 

