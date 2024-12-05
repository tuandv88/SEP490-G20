
namespace Payment.Domain.Models;
public class Transaction : Aggregate<TransactionId> {
    public UserId UserId { get; set; } = default!;
    public double Amount { get; set; }
    public string Currency { get; set; } = default!; // loại tiền tệ
    public TransactionStatus Status { get; set; } = TransactionStatus.Created;
    public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.Paypal;
    public string ExternalOrderId { get; set; } = string.Empty; // paypal, momo thường có một mẫu đơn hàng để giữ duy nhất cho request
    public string ExternalTransactionId { get; set; } = string.Empty;
    public double GrossAmount { get; set; } // tổng tiền trước khi tính phí
    public double NetAmount { get; set; } // số tiền sau khi tính phí
    public double FeeAmount { get; set; } // tiền phí 
    public string? PayerId { get; set; } // Paypal 
    public string? PayerEmail { get; set; } // Paypal
    public string? PayerPhone { get; set; } // Momo
    public string Fullname { get; set; } = string.Empty;
    public int PointsUsed { get; set; } = 0;
    public double DiscountAmount { get; set; } = 0; // số tiền đã giảm khi dùng point
    public List<TransactionItem> Items { get; set; } = new();
    public List<TransactionLog> Logs { get; set; } = new();
}

