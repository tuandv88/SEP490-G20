using BuildingBlocks.CQRS;
using BuildingBlocks.Exceptions;
using Payment.Application.Data.Repositories;
using Payment.Application.Interfaces;
using Payment.Domain.Enums;
using Payment.Domain.Models;
using Payment.Domain.ValueObjects;

namespace Payment.Application.Transactions.Commands.CancelTransaction;

public class CancelTransactionHandler(ITransactionRepository repository, IUserContextService userContext)
    : ICommandHandler<CancelTransactionCommand, CancelTransactionResult>
{
    public async Task<CancelTransactionResult> Handle(CancelTransactionCommand request,
        CancellationToken cancellationToken)
    {
        var userId = userContext.User.Id;
        var transaction = repository.GetAllAsQueryable()
            .FirstOrDefault(x => x.UserId.Equals(UserId.Of(userId)) && x.Id.Equals(TransactionId.Of(request.TransactionId)));
        if (transaction == null)
        {
            throw new NotFoundException(nameof(Transaction), request.TransactionId);
        }
        
        if (transaction.Status == TransactionStatus.Created)
        {
            var timeSinceCreated = DateTime.UtcNow - transaction.CreatedAt;
            if (timeSinceCreated <= TimeSpan.FromMinutes(30))
            {
                return new CancelTransactionResult("Transaction cannot be cancelled as it was created less than 30 minutes ago.");
            }
            transaction.Status = TransactionStatus.Cancelled;
            await repository.UpdateAsync(transaction);
            await repository.SaveChangesAsync(cancellationToken);
            return new CancelTransactionResult("Transaction cancelled successfully.");
        }
        return new CancelTransactionResult("Transaction cancelled failed.");
    }
}