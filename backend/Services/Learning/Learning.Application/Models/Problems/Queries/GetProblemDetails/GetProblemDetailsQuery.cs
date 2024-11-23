using Learning.Application.Models.Problems.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Problems.Queries.GetProblemDetails;

[Authorize($"{PoliciesType.Administrator}")]
public record GetProblemDetailsQuery(Guid Id) : IQuery<GetProblemDetailsResult>;
public record GetProblemDetailsResult(ProblemDetailsDto ProblemDetailsDto);
