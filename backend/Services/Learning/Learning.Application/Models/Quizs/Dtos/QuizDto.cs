namespace Learning.Application.Models.Quizs.Dtos;
public record QuizDto(
    Guid Id,
    string Title,
    string Description,
    int PassingMark,
    double TimeLimit,
    bool HasTimeLimit,
    int AttemptLimit,
    int AttemptCount,
    bool HasAttemptLimit
);

