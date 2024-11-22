namespace Learning.Application.Models.Submissions.Dtos;
public record SubmissionLectureViewDto(
    DateTime SubmissionDate,
    string Language,
    int TotalTestCase,
    int TestCasePassCount,
    double ExecutionTime,
    long MemoryUsage,
    string? RunTimeErrors,
    string? CompileErrors
);