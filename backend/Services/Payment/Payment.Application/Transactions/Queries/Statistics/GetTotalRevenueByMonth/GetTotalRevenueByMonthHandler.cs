using BuildingBlocks.CQRS;
using Microsoft.EntityFrameworkCore;
using Payment.Application.Data.Repositories;
using Payment.Application.Transactions.Dtos;
using Payment.Domain.Enums;

namespace Payment.Application.Transactions.Queries.Statistics.GetTotalRevenueByMonth;

public class GetTotalRevenueByMonthHandler(ITransactionRepository repository) : IQueryHandler<GetTotalRevenueByMonthQuery, GetTotalRevenueByMonthResult>
{
    public async Task<GetTotalRevenueByMonthResult> Handle(GetTotalRevenueByMonthQuery request, CancellationToken cancellationToken)
    {
        var transactions =  repository.GetAllAsQueryable();
        
        var totalRevenueByMonth = await transactions
            .Where(t => t.Status == TransactionStatus.Completed) 
            .Where(t => t.GrossAmount > 0 && t.CreatedAt >= request.StartDate && t.CreatedAt <= request.EndDate) 
            .GroupBy(t => new { t.CreatedAt!.Value.Year, t.CreatedAt!.Value.Month })
            .Select(g => new RevenueByMonthDto(
                g.Key.Year,
                g.Key.Month,
                g.Sum(t => t.GrossAmount)
            ))
            .ToListAsync(cancellationToken);
        return new GetTotalRevenueByMonthResult(totalRevenueByMonth);
    }
}