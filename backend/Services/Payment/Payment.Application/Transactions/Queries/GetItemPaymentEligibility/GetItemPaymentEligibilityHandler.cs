using BuildingBlocks.CQRS;
using Microsoft.EntityFrameworkCore;
using Payment.Application.Data.Repositories;
using Payment.Application.Interfaces;
using Payment.Domain.Enums;
using Payment.Domain.ValueObjects;

namespace Payment.Application.Transactions.Queries.GetItemPaymentEligibility;

public class GetItemPaymentEligibilityHandler(
    ITransactionRepository transactionRepository,
    ITransactionItemRepository transactionItemRepository,
    IUserContextService userContext
)
    : IQueryHandler<GetItemPaymentEligibilityQuery, GetItemPaymentEligibilityResult>
{
    public async Task<GetItemPaymentEligibilityResult> Handle(GetItemPaymentEligibilityQuery request,
        CancellationToken cancellationToken)
    {
        var userId = userContext.User.Id;
        var transaction = await transactionRepository.GetAllAsQueryable()
            .Where(t => t.UserId.Equals(UserId.Of(userId)))
            .FirstOrDefaultAsync(t => transactionItemRepository.GetAllAsQueryable()
                .Any(ti => ti.TransactionId.Equals(t.Id) && ti.ProductId.Equals(request.ProductId)), cancellationToken);

        if (transaction == null)
        {
            return new GetItemPaymentEligibilityResult(true);
        }

        return transaction.Status is TransactionStatus.Created or TransactionStatus.Completed
            ? new GetItemPaymentEligibilityResult(false)
            : new GetItemPaymentEligibilityResult(true);
    }
}