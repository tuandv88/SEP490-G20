using BuildingBlocks.CQRS;
using Microsoft.AspNetCore.Authorization;
using Payment.Application.Commons;

namespace Payment.Application.Transactions.Queries.Statistics.GetMonthlyCourseSalesWithGrowth;

[Authorize($"{PoliciesType.Administrator}")]
public record GetMonthlyCourseSalesWithGrowthQuery : IQuery<GetMonthlyCourseSalesWithGrowthResult>;
public record GetMonthlyCourseSalesWithGrowthResult(int CurrentMonthSales, double GrowthRate);