namespace BuildingBlocks.Messaging.Events.Payments.Sagas.Commands;
public record SendEmailNotificationCommand {
    public Guid TransactionId { get; set; }
    public string Fullname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public string ProductDescription { get; set; } = string.Empty;
    public double Amount { get; set; }
    public string EmailType { get; set; } = string.Empty;
    public string PaymentType { get; set; } = string.Empty;
    public Guid ProductId { get; set; }
}

public static class EmailType
{
    public const string PaymentSuccess = "PaymentSuccess";
    public const string PaymentFailed = "PaymentFailed";
}
