namespace Learning.Application.Models.Quizs.Dtos;
public record UpdateQuizDto(
    bool IsActive,
    bool IsRandomized,
    string Title,
    string Description,
    int PassingMark,
    double TimeLimit,
    bool HasTimeLimit,
    int AttemptLimit,
    bool HasAttemptLimit,
    string QuizType
);