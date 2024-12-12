using BuildingBlocks.CQRS;
using BuildingBlocks.Pagination;
using Microsoft.AspNetCore.Authorization;
using Payment.Application.Commons;
using Payment.Application.Transactions.Dtos;

namespace Payment.Application.Transactions.Queries.GetTransactionAudit;

[Authorize($"{PoliciesType.Administrator}")]
public record GetTransactionAuditQuery(PaginationRequest PaginationRequest, GetTransactionAuditFilter Filter) : IQuery<GetTransactionAuditResult>;
public record GetTransactionAuditResult(PaginatedResult<TransactionAuditDto> Transactions);
public record GetTransactionAuditFilter(
    DateTime? StartDate,
    DateTime? EndDate,
    string? Status,
    string? PaymentMethod,
    Guid? UserId,
    string? Currency,
    double? MinAmount,
    double? MaxAmount,
    string? ExternalOrderId,
    string? ExternalTransactionId,
    string? PayerEmail,
    string? Fullname,
    string? ProductType,
    string? ProductId,
    string? ProductName,
    bool? IsDescending
    );