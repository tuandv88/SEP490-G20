using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Problems.Commands.DeleteProblem;

[Authorize($"{PoliciesType.Administrator}")]
public record DeleteProblemCommand(Guid Id): ICommand;
