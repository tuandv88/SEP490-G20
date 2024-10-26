using Learning.Application.Models.Questions.Dtos;

namespace Learning.Application.Models.Quizs.Dtos;
public record QuizDto(
    Guid Id,
    string Title,
    string Description,
    int PassingMark,
    double TimeLimit,
    bool HasTimeLimit,
    int AttemptLimit,
    bool HasAttemptLimit,
    List<QuestionDto> Questions
);

