using Payment.Application.Transactions.Dtos;
using Payment.Domain.Models;

namespace Payment.Application.Extensions;
public static class TransactionItemExtensions {
    public static TransactionItemDto ToTransactionItemDto(this TransactionItem transactionItem) {
        return new TransactionItemDto(
            transactionItem.ProductId,
            transactionItem.ProductType.ToString(),
            transactionItem.ProductName,
            transactionItem.Quantity,
            transactionItem.UnitPrice
            );
    }
}

