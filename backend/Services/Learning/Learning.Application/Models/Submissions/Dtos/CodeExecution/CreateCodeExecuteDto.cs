namespace Learning.Application.Models.Submissions.Dtos.CodeExecution;
public record CreateCodeExecuteDto(
     Guid ProblemId,
     string LanguageCode,
     string SourceCode,
     List<string> TestCaseInput
);

