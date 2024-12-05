namespace BuildingBlocks.Messaging.Events.Payments.Sagas;
public record ProductValidationFailedEvent {
    public Guid TransactionId { get; set; }
    public string Reason {  get; set; } = string.Empty;
}

