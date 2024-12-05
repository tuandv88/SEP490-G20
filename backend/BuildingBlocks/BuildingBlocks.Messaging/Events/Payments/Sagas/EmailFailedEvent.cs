namespace BuildingBlocks.Messaging.Events.Payments.Sagas;
public record EmailFailedEvent {
    public Guid TransactionId { get; set; }
}

