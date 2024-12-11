using BuildingBlocks.CQRS;
using Payment.Application.Data.Repositories;
using Payment.Domain.Enums;
using Payment.Domain.Models;
using Payment.Domain.ValueObjects;

namespace Payment.Application.Transactions.Queries.Statistics.GetMonthlyCourseSalesWithGrowth;

public class GetMonthlyCourseSalesWithGrowthHandler(ITransactionRepository repository, ITransactionItemRepository transactionItemRepository) 
    : IQueryHandler<GetMonthlyCourseSalesWithGrowthQuery, GetMonthlyCourseSalesWithGrowthResult>
{
    public Task<GetMonthlyCourseSalesWithGrowthResult> Handle(GetMonthlyCourseSalesWithGrowthQuery request, CancellationToken cancellationToken)
    {
        var currentDate = DateTime.UtcNow;
        var currentMonthStart = DateTime.SpecifyKind(new DateTime(currentDate.Year, currentDate.Month, 1), DateTimeKind.Utc);
        var previousMonthStart = currentMonthStart.AddMonths(-1);
        var currentMonthEnd = currentMonthStart.AddMonths(1).AddTicks(-1);
        
        var transactions = repository.GetAllAsQueryable()
            .Where(t => t.Status == TransactionStatus.Completed &&
                        t.CreatedAt >= previousMonthStart &&
                        t.CreatedAt <= currentMonthEnd)
            .ToList();
        
        var currentMonthTransactions = transactions
            .Where(t => t.CreatedAt >= currentMonthStart && t.CreatedAt <= currentMonthEnd)
            .Select(t => t.Id)
            .ToHashSet();

        var previousMonthTransactions = transactions
            .Where(t => t.CreatedAt >= previousMonthStart && t.CreatedAt < currentMonthStart)
            .Select(t => t.Id)
            .ToHashSet();
        
        var currentMonthSales = transactionItemRepository.GetAllAsQueryable()
            .Where(item => item.ProductType == ProductType.Course &&
                           currentMonthTransactions.Contains(item.TransactionId))
            .Sum(item => item.Quantity);
        
        var previousMonthSales = transactionItemRepository.GetAllAsQueryable()
            .Where(item => item.ProductType == ProductType.Course &&
                           previousMonthTransactions.Contains(item.TransactionId))
            .Sum(item => item.Quantity);
        
        var growthPercentage = previousMonthSales > 0
            ? Math.Round(((currentMonthSales - previousMonthSales) / (double)previousMonthSales) * 100, 2)
            : 100;
        
        return Task.FromResult(new GetMonthlyCourseSalesWithGrowthResult(currentMonthSales, growthPercentage));
    }
}
