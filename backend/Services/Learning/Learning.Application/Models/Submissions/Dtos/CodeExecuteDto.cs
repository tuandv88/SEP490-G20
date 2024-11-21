namespace Learning.Application.Models.Submissions.Dtos;
public record CodeExecuteDto(
    string Token,
    string? RunTimeErrors,
    string? CompileErrors,
    double ExecutionTime,
    long MemoryUsage,
    List<TestResult> TestResults,
    SubmissionStatus Status,
    string LanguageCode
);

