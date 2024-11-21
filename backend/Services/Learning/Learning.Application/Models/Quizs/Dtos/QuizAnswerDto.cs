using Learning.Application.Models.Quizs.Dtos.SubmissionDto;

namespace Learning.Application.Models.Quizs.Dtos;
public record QuizAnswerDto(
    Guid QuizSubmissionId,
    DateTime StartTime,
    List<QuestionAnswerDto> QuestionAnswers
);

