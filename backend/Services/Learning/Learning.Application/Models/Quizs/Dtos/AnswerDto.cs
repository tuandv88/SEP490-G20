using Learning.Application.Models.Quizs.Dtos.SubmissionDto;

namespace Learning.Application.Models.Quizs.Dtos;
public record AnswerDto(
    Guid QuizSubmissionId,
    DateTime StartTime,
    List<QuestionAnswerDto> QuestionAnswers
);

