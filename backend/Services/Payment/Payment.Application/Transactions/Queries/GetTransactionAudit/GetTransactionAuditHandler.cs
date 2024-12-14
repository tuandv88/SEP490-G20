using System.Diagnostics.CodeAnalysis;
using BuildingBlocks.CQRS;
using BuildingBlocks.Pagination;
using Microsoft.EntityFrameworkCore;
using Payment.Application.Data.Repositories;
using Payment.Application.Transactions.Dtos;
using Payment.Domain.Enums;
using Payment.Domain.ValueObjects;

namespace Payment.Application.Transactions.Queries.GetTransactionAudit;

public class GetTransactionAuditHandler(
    ITransactionRepository transactionRepository,
    ITransactionItemRepository transactionItemRepository)
    : IQueryHandler<GetTransactionAuditQuery, GetTransactionAuditResult>
{
    [SuppressMessage("ReSharper.DPA", "DPA0006: Large number of DB commands", MessageId = "count: 50")]
    public async Task<GetTransactionAuditResult> Handle(GetTransactionAuditQuery request,
        CancellationToken cancellationToken)
    {
        var transactions = transactionRepository.GetAllAsQueryable();
        var transactionItems = transactionItemRepository.GetAllAsQueryable();

        var pageIndex = request.PaginationRequest.PageIndex;
        var pageSize = request.PaginationRequest.PageSize;
        var filter = request.Filter;

        // Apply Date Range Filter
        if (filter.StartDate.HasValue)
        {
            transactions = transactions.Where(t => t.CreatedAt >= filter.StartDate.Value);
        }

        if (filter.EndDate.HasValue)
        {
            transactions = transactions.Where(t => t.CreatedAt <= filter.EndDate.Value);
        }

        // Apply Status Filter
        if (filter.Status != null)
        {
            if (Enum.TryParse<TransactionStatus>(filter.Status, true, out var status))
            {
                transactions = transactions.Where(t => t.Status == status);
            }
        }

        // Apply Payment Method Filter
        if (filter.PaymentMethod != null)
        {
            if (Enum.TryParse<PaymentMethod>(filter.PaymentMethod, true, out var paymentMethod))
            {
                transactions = transactions.Where(t => t.PaymentMethod == paymentMethod);
            }
        }

        // Apply UserId Filter
        if (filter.UserId.HasValue && filter.UserId.Value != Guid.Empty)
        {
            transactions = transactions.Where(t => t.UserId.Equals(UserId.Of(filter.UserId.Value)));
        }

        // Apply Currency Filter
        if (!string.IsNullOrWhiteSpace(filter.Currency))
        {
            transactions =
                transactions.Where(t => t.Currency.ToLower().Equals(filter.Currency.ToLower()));
        }

        // Apply Amount Range Filter
        if (filter.MinAmount.HasValue)
        {
            transactions = transactions.Where(t => t.Amount >= filter.MinAmount.Value);
        }

        if (filter.MaxAmount.HasValue)
        {
            transactions = transactions.Where(t => t.Amount <= filter.MaxAmount.Value);
        }

        // Apply ExternalOrderId Filter
        if (!string.IsNullOrWhiteSpace(filter.ExternalOrderId))
        {
            transactions = transactions.Where(t => t.ExternalOrderId.Equals(filter.ExternalOrderId));
        }

        // Apply ExternalTransactionId Filter
        if (!string.IsNullOrWhiteSpace(filter.ExternalTransactionId))
        {
            transactions = transactions.Where(t => t.ExternalTransactionId.Equals(filter.ExternalTransactionId));
        }

        // Apply PayerEmail Filter
        if (!string.IsNullOrWhiteSpace(filter.PayerEmail))
        {
            transactions = transactions.Where(t => t.PayerEmail != null && t.PayerEmail.Contains(filter.PayerEmail));
        }

        // Apply Fullname Filter
        if (!string.IsNullOrWhiteSpace(filter.Fullname))
        {
            transactions = transactions.Where(t => t.Fullname.Contains(filter.Fullname));
        }

        // Apply ProductType Filter
        if (filter.ProductType != null)
        {
            if (Enum.TryParse<ProductType>(filter.ProductType, true, out var productTypeEnum))
            {
                transactions = transactions.Where(t =>
                    transactionItems
                        .Any(ti => ti.TransactionId == t.Id && ti.ProductType == productTypeEnum));
            }
        }

        // Apply ProductId Filter
        if (!string.IsNullOrWhiteSpace(filter.ProductId))
        {
            transactions = transactions.Where(t =>
                transactionItems.Where(ti => ti.TransactionId.Equals(t.Id))
                    .Any(i => i.ProductId.Equals(filter.ProductId)));
        }

        // Apply ProductName Filter
        if (!string.IsNullOrWhiteSpace(filter.ProductName))
        {
            transactions = transactions.Where(t =>
                transactionItems.Where(ti => ti.TransactionId.Equals(t.Id)).Any(i =>
                    i.ProductName.ToLower().Contains(filter.ProductName.ToLower())));
        }

        if (filter.IsDescending.HasValue)
        {
            transactions = filter.IsDescending.Value
                ? transactions.OrderByDescending(t => t.CreatedAt)
                : transactions.OrderBy(t => t.CreatedAt);
        }
        else
        {
            transactions = transactions.OrderByDescending(t => t.CreatedAt);
        }

        // Fetch the filtered transactions with pagination
        var paginatedTransactions = await transactions
            .Skip((pageIndex - 1) * pageSize)
            .Take(pageSize)
            .Select(t => new TransactionAuditDto(
                t.Id.Value,
                t.UserId.Value,
                t.Amount,
                t.Currency,
                t.Status.ToString(),
                t.PaymentMethod.ToString(),
                t.ExternalOrderId,
                t.ExternalTransactionId,
                t.GrossAmount,
                t.NetAmount,
                t.FeeAmount,
                t.PayerId ?? string.Empty,
                t.PayerEmail ?? string.Empty,
                t.Fullname,
                t.PointsUsed,
                t.DiscountAmount,
                new(),
                t.CreatedAt!.Value,
                t.LastModified!.Value
            ))
            .ToListAsync(cancellationToken);
        // Assuming transactionItems is available in this context
        paginatedTransactions = paginatedTransactions.Select(t => t with
        {
            Items = transactionItems
                .Where(ti => ti.TransactionId.Equals(TransactionId.Of(t.TransactionId)))
                .Select(i => new TransactionItemAuditDto(
                    i.ProductId,
                    i.ProductType.ToString(),
                    i.ProductName,
                    i.Quantity,
                    i.UnitPrice
                ))
                .ToList()
        }).ToList();
        // Get total count for pagination
        var totalCount = await transactions.CountAsync(cancellationToken);

        return new GetTransactionAuditResult(
            new PaginatedResult<TransactionAuditDto>(pageIndex, pageSize, totalCount, paginatedTransactions));
    }
}