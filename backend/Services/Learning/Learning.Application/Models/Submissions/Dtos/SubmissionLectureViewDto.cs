namespace Learning.Application.Models.Quizs.Dtos;
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