using Payment.Application.Transactions.Dtos;
using Payment.Domain.Models;

namespace Payment.Application.Extensions;
public static class TransactionExtensions {
    public static TransactionDto ToTransactionDto(this Transaction transaction) {
        return new TransactionDto(
            transaction.PointsUsed,
            transaction.GrossAmount,
            transaction.DiscountAmount,
            transaction.LastModified!.Value,
            transaction.Status.ToString(),
            transaction.PaymentMethod.ToString(),
            Items: transaction.Items.Select(i => i.ToTransactionItemDto()).ToList()
            );
    }
}

