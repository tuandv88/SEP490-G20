
namespace BuildingBlocks.Messaging.Events.Payments.Sagas;
public record PaymentSuccessEvent {
    public Guid TransactionId { get; set; }
    public Guid UserId { get; set; }
    public Guid ProductId { get; set; }
    public string ProductType { get; set; } = string.Empty;
}

