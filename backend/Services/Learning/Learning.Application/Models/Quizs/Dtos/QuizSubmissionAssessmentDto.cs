namespace Learning.Application.Models.Quizs.Dtos;
public record QuizSubmissionAssessmentDto(
    Guid QuizId,
    string Title,
    bool IsActive,
    List<AssessmentDto> QuizSubmissions
);
public record AssessmentDto(
  Guid QuizSubmissionId,
  DateTime SubmissionDate
);
