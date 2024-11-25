namespace Payment.Domain.Models;
public class Transaction : Aggregate<TransactionId>{
    public UserId UserId { get; set; } = default!;
    public double Amount { get; set; }
    public string Currency { get; set; } = default!; // loại tiền tệ
    public TransactionStatus Status { get; set; } = TransactionStatus.Pending;
    public PaymentMethodId PaymentMethodId { get; set; } = default!;
    public ProductId ProductId { get; set; } = default!;
    public ProductType ProductType { get; set; } = ProductType.Course;
    public string? ThirdPartyTransactionId { get; set; } = default!;
    public string? ThirdPartyCaptureId {  get; set; } = default!;
}

