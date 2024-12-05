namespace Payment.Domain.Models;
public class TransactionLog : Entity<TransactionLogId> {
    public TransactionId TransactionId { get; set; } = default!;
    public string Action { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

