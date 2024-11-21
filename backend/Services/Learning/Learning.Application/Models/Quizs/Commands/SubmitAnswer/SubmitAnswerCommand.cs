using Learning.Application.Models.Quizs.Dtos.SubmissionDto;

namespace Learning.Application.Models.Quizs.Commands.SubmitAnswer;
public record SubmitAnswerCommand(Guid QuizSubmissionId, QuestionAnswerDto Question): ICommand<SubmitAnswerResult>;
public record SubmitAnswerResult(bool IsSuccess);

