using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Problems.Queries.GetStatistics.GetMonthlyProblemSubmissionsComparison;
[Authorize($"{PoliciesType.Administrator}")]
public record GetMonthlyProblemSubmissionsComparisonQuery : IQuery<GetMonthlyProblemSubmissionsComparisonResult>;
public record GetMonthlyProblemSubmissionsComparisonResult(int CurrentMonthCount, int PreviousMonthCount, double PercentageChange);
