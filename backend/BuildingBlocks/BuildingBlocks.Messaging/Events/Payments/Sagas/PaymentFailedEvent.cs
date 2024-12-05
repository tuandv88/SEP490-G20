namespace BuildingBlocks.Messaging.Events.Payments.Sagas;
public record PaymentFailedEvent {
    public Guid TransactionId { get; set; }
    public string Reason { get; set; } = string.Empty;
}

