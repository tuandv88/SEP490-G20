namespace Learning.Application.Models.Quizs.Dtos;
public record QuizSubmissionDto(
    Guid QuizSubmissionId,
    DateTime StartTime,
    DateTime SubmissionDate,
    long Score,
    long TotalScore,
    int TotalQuestions,
    int CorrectAnswers,
    int PassingMark,
    long Duration,
    string Status
);

