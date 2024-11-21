namespace Learning.Application.Models.Submissions.Dtos;
public record CodeExecuteSolutionDto(
    string FileName,
    string SolutionCode,
    int LanguageId
);

