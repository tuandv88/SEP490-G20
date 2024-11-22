using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Quizs.Commands.DeleteQuiz;
[Authorize($"{PoliciesType.Administrator}")]
public record DeleteQuizCommand(Guid QuizId) : ICommand;