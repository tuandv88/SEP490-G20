using Learning.Application.Models.Problems.Dtos;

namespace Learning.Application.Models.Problems.Queries.GetProblems;
public record GetProblemsQuery(PaginationRequest PaginationRequest) : IQuery<GetProblemsResult>;
public record GetProblemsResult(PaginatedResult<ProblemListDto> Problems);

