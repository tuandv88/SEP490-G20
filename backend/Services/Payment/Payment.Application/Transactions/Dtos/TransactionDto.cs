namespace Payment.Application.Transactions.Dtos;
public record TransactionDto(
    int PointsUsed,
    double GrossAmount,
    double DiscountAmount,
    DateTime DateTime,
    string Status,
    string PaymentMethod,
    List<TransactionItemDto> Items
);

public record TransactionItemDto(
    string ProductId,
    string ProductType,
    string ProductName,
    int Quantity,
    double UnitPrice
);
