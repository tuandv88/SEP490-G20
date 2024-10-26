namespace Learning.Application.Models.Submissions.Dtos.CodeExecution;
public record CodeExecuteTestScriptDto(
    string FileName,
    string TestCode,
    string LanguageCode,
    List<string> Input
);

