using Learning.Application.Models.Problems.Dtos;

namespace Learning.Application.Models.Problems.Queries.GetProblemDetails;

public record GetProblemDetailsQuery(Guid Id) : IQuery<GetProblemDetailsResult>;
public record GetProblemDetailsResult(ProblemDetailsDto ProblemDetailsDto);
