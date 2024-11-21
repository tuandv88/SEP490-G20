using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Quizs.Commands.ChangeQuizStatus;

[Authorize($"{PoliciesType.Administrator}")]
public record ChangeQuizStatusCommand(Guid Id) : ICommand<ChangeQuizStatusResult>;
public record ChangeQuizStatusResult(bool IsSuccess);

