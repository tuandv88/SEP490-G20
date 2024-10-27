using Learning.Application.Models.Problems.Dtos;

namespace Learning.Application.Models.Problems.Queries.GetProblemById;
public record GetProblemByIdQuery(Guid Id) : IQuery<GetProblemByIdResult>;
public record GetProblemByIdResult(ProblemDto ProblemDto);

