namespace Learning.Application.Models.Submissions.Dtos;
public record CodeExecuteTestScriptDto(
    string FileName,
    string TestCode,
    string LanguageCode,
    List<string> Input
);

