namespace Payment.Application.Transactions.Dtos;

public record TransactionAuditDto(
    Guid TransactionId,
    Guid UserId,
    double Amount,
    string Currency,
    string Status,
    string PaymentMethod,
    string ExternalOrderId,
    string ExternalTransactionId,
    double GrossAmount,
    double NetAmount,
    double FeeAmount,
    string PayerId,
    string PayerEmail,
    string Fullname,
    int PointsUsed,
    double DiscountAmount,
    List<TransactionItemAuditDto> Items,
    DateTime CreatedAt,
    DateTime LastModified
);
public record TransactionItemAuditDto(
    string ProductId,
    string ProductType,
    string ProductName,
    int Quantity,
    double UnitPrice
    );