using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Questions.Commands.DeleteQuestion;
[Authorize($"{PoliciesType.Administrator}")]
public record DeleteQuestionCommand(Guid QuizId, Guid QuestionId) : ICommand;

