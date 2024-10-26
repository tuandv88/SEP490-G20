namespace Learning.Application.Models.Submissions.Dtos.CodeExecution;
public record CodeExecuteSolutionDto(
    string FileName,
    string SolutionCode,
    int LanguageId 
);

