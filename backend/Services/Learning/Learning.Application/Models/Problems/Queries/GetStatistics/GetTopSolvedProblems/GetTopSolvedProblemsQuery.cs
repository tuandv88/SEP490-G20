using Learning.Application.Models.Problems.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Problems.Queries.GetStatistics.GetTopSolvedProblems;
[Authorize($"{PoliciesType.Administrator}")]
public record GetTopSolvedProblemsQuery(PaginationRequest PaginationRequest) : IQuery<GetTopSolvedProblemsResult>;
public record GetTopSolvedProblemsResult(PaginatedResult<TopSolvedProblemDto> Problems);
