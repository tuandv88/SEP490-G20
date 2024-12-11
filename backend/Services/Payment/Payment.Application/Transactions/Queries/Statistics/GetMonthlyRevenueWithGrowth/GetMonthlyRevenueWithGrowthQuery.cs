using BuildingBlocks.CQRS;
using Microsoft.AspNetCore.Authorization;
using Payment.Application.Commons;

namespace Payment.Application.Transactions.Queries.Statistics.GetMonthlyRevenueWithGrowth;

[Authorize($"{PoliciesType.Administrator}")]
public record GetMonthlyRevenueWithGrowthQuery: IQuery<GetMonthlyRevenueWithGrowthResult>;
public record GetMonthlyRevenueWithGrowthResult(double TotalRevenue, double GrowthRate);