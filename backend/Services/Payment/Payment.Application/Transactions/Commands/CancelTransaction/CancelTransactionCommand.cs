using BuildingBlocks.CQRS;
using Microsoft.AspNetCore.Authorization;

namespace Payment.Application.Transactions.Commands.CancelTransaction;

[Authorize]
public record CancelTransactionCommand(Guid TransactionId) : ICommand<CancelTransactionResult>;
public record CancelTransactionResult(string Message);