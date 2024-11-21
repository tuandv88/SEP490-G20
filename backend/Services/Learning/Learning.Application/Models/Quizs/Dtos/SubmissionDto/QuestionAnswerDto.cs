namespace Learning.Application.Models.Quizs.Dtos.SubmissionDto;
public record QuestionAnswerDto(
  Guid QuestionId,
  List<Guid>? QuestionAnswerId,
  QuestionProblemDto? Problem
);

