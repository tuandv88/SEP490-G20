namespace BuildingBlocks.Messaging.Events.Payments.Sagas;
public record EmailSentEvent {
    public Guid TransactionId { get; set; }
}

