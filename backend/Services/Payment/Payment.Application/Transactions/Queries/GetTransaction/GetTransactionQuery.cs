
using BuildingBlocks.CQRS;
using BuildingBlocks.Pagination;
using Microsoft.AspNetCore.Authorization;
using Payment.Application.Transactions.Dtos;

namespace Payment.Application.Transactions.Queries.GetTransaction;
[Authorize]
public record GetTransactionQuery(PaginationRequest PaginationRequest) : IQuery<GetTransactionResult>;
public record GetTransactionResult(int TotalPointUsed, PaginatedResult<TransactionDto> Transactions);

