using Learning.Application.Models.Questions.Dtos;

namespace Learning.Application.Models.Quizs.Dtos;
public record QuizDetailDto(
    Guid QuizId,
    List<QuestionDto> Questions
);

