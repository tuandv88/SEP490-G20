using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Courses.Queries.GetStatistics.GetMonthlyNewLearnersComparison;
[Authorize($"{PoliciesType.Administrator}")]
public record GetMonthlyNewLearnersComparisonQuery: IQuery<GetMonthlyNewLearnersComparisonResult>;
public record GetMonthlyNewLearnersComparisonResult(int CurrentMonthCount, int PreviousMonthCount, double PercentageChange);

