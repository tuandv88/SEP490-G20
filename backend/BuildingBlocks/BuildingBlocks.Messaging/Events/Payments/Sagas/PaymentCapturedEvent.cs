namespace BuildingBlocks.Messaging.Events.Payments.Sagas;
public record PaymentCapturedEvent {
    public Guid TransactionId { get; set; }
}
