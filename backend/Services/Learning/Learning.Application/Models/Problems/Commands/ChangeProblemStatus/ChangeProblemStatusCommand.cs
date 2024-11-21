using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Problems.Commands.ChangeProblemStatus;

[Authorize($"{PoliciesType.Administrator}")]
public record ChangeProblemStatusCommand(Guid ProblemId): ICommand<ChangeProblemStatusResult>;
public record ChangeProblemStatusResult(bool IsSuccess);
