using Learning.Domain.ValueObjects;

namespace Learning.Application.Models.Submissions.Dtos.CodeExecution;
public record CodeExecuteDto(
    string? RunTimeErrors,
    string? CompileErrors,
    double ExecutionTime,
    long MemoryUsage,
    List<TestResult> TestResults,
    SubmissionStatus Status,
    string LanguageCode
);

