
namespace Learning.Application.Models.Submissions.Dtos;
public record SubmissionLectureViewRankDto(
    Guid UserId,
    string Language,
    int AttemptCount,
    double ExecutionTime,
    DateTime SubmissionDate,
    int TotalTestCase,
    int TestCasePassCount,
    long MemoryUsage,
    string? RunTimeErrors,
    string? CompileErrors
);

