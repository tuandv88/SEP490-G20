using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Quizs.Commands.SubmissionQuiz;
[Authorize]
public record SubmissionQuizCommand(Guid QuizSubmissionId): ICommand<SubmissionQuizResult>;
public record SubmissionQuizResult(string Status);
