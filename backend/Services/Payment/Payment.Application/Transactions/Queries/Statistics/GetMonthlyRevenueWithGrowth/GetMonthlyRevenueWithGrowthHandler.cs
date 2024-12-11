using BuildingBlocks.CQRS;
using Microsoft.EntityFrameworkCore;
using Payment.Application.Data.Repositories;
using Payment.Domain.Enums;

namespace Payment.Application.Transactions.Queries.Statistics.GetMonthlyRevenueWithGrowth;

public class
    GetMonthlyRevenueWithGrowthHandler(ITransactionRepository repository) : IQueryHandler<GetMonthlyRevenueWithGrowthQuery,
    GetMonthlyRevenueWithGrowthResult>
{
    public async Task<GetMonthlyRevenueWithGrowthResult> Handle(GetMonthlyRevenueWithGrowthQuery request, CancellationToken cancellationToken)
    {
        var currentDate = DateTime.UtcNow;
        var currentMonth = currentDate.Month;
        var currentYear = currentDate.Year;

        var previousMonthDate = currentDate.AddMonths(-1);
        var previousMonth = previousMonthDate.Month;
        var previousYear = previousMonthDate.Year;
        
        var transactions = repository.GetAllAsQueryable();
        
        var currentMonthRevenue = await transactions
            .Where(t => t.Status == TransactionStatus.Completed
                        && t.CreatedAt!.Value.Month == currentMonth
                        && t.CreatedAt.Value.Year == currentYear)
            .SumAsync(t => t.NetAmount, cancellationToken);
        
        currentMonthRevenue = Math.Round(currentMonthRevenue, 2);
        var previousMonthRevenue = await transactions
            .Where(t => t.Status == TransactionStatus.Completed
                        && t.CreatedAt!.Value.Month == previousMonth
                        && t.CreatedAt!.Value.Month == previousYear)
            .SumAsync(t => t.NetAmount, cancellationToken);
        
        var growthRate = previousMonthRevenue > 0
            ? Math.Round((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100, 2)
            : 100;
        
        return new GetMonthlyRevenueWithGrowthResult(currentMonthRevenue, growthRate);
    }
}