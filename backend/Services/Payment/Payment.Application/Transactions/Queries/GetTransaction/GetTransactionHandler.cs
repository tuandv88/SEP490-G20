using BuildingBlocks.CQRS;
using BuildingBlocks.Pagination;
using Microsoft.EntityFrameworkCore;
using Payment.Application.Commons;
using Payment.Application.Data.Repositories;
using Payment.Application.Extensions;
using Payment.Application.Interfaces;
using Payment.Application.Transactions.Dtos;
using Payment.Domain.Enums;
using Payment.Domain.ValueObjects;

namespace Payment.Application.Transactions.Queries.GetTransaction;
public class GetTransactionHandler(ITransactionRepository repository, IUserContextService userContext) : IQueryHandler<GetTransactionQuery, GetTransactionResult> {
    public async Task<GetTransactionResult> Handle(GetTransactionQuery query, CancellationToken cancellationToken) {

        var userId = userContext.User.Id;

        var allData = repository.GetAllAsQueryable();
        // Phân trang
        var pageIndex = query.PaginationRequest.PageIndex;
        var pageSize = query.PaginationRequest.PageSize;

        var filteredData = allData
            .Include(t => t.Items)
            .Where(t => t.UserId.Equals(UserId.Of(userId)));

        var totalPointUsed = await filteredData
            .Where(t => t.Status == TransactionStatus.Completed)
            .SumAsync(t => t.PointsUsed, cancellationToken); 

        var totalCount = await filteredData.CountAsync(cancellationToken);

        var transactions = filteredData.OrderByDescending(c => c.LastModified)
                                    .Skip(pageSize * (pageIndex - 1))
                                    .Take(pageSize)
                                    .ToList();

        var transactionDto = transactions.Select(t => t.ToTransactionDto()).ToList();

        return new GetTransactionResult(totalPointUsed,
            new PaginatedResult<TransactionDto>(pageIndex, pageSize, totalCount, transactionDto));
    }
}

