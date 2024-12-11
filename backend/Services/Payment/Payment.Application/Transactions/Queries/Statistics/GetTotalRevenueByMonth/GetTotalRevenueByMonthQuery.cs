using BuildingBlocks.CQRS;
using Microsoft.AspNetCore.Authorization;
using Payment.Application.Commons;
using Payment.Application.Transactions.Dtos;

namespace Payment.Application.Transactions.Queries.Statistics.GetTotalRevenueByMonth;
[Authorize($"{PoliciesType.Administrator}")]
public record GetTotalRevenueByMonthQuery(DateTime StartDate, DateTime EndDate) : IQuery<GetTotalRevenueByMonthResult>;
public record GetTotalRevenueByMonthResult(List<RevenueByMonthDto> Revenues);