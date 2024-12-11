namespace Learning.Application.Models.Submissions.Dtos;
public record SubmissionResponseDto(
    string Token,
    string SourceCode,
    string? RunTimeErrors,
    string? CompileErrors,
    double ExecutionTime,
    long MemoryUsage,
    TestResult? TestFail,
    SubmissionStatus Status,
    string LanguageCode,
    int TotalTestCase,
    int TestCasePass,
    DateTime SubmissionDate
);

