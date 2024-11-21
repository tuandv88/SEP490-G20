using Learning.Application.Models.Questions.Dtos;

namespace Learning.Application.Models.Quizs.Dtos;
public record QuizFullDto(
    Guid Id,
    bool IsActive,
    bool IsRandomized,
    string Title,
    string Description,
    int PassingMark,
    double TimeLimit,
    bool HasTimeLimit,
    int AttemptLimit,
    bool HasAttemptLimit,
    string QuizType,
    List<QuestionFullDto> Questions
);