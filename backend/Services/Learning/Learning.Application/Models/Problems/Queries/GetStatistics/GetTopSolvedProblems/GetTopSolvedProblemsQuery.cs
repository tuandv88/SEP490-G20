using Learning.Application.Models.Problems.Dtos;

namespace Learning.Application.Models.Problems.Queries.GetStatistics.GetTopSolvedProblems;
public record GetTopSolvedProblemsQuery(PaginationRequest PaginationRequest) : IQuery<GetTopSolvedProblemsResult>;
public record GetTopSolvedProblemsResult(PaginatedResult<TopSolvedProblemDto> Problems);
