using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Quizs.Commands.StartQuiz;

[Authorize]
public record StartQuizCommand(Guid QuizId): ICommand<StartQuizResult>;
public record StartQuizResult(Guid QuizSubmissionId);

    