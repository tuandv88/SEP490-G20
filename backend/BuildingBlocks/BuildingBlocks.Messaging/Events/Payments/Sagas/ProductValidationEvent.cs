namespace BuildingBlocks.Messaging.Events.Payments.Sagas;
public record ProductValidationEvent {
    public Guid TransactionId { get; set; }
    public bool IsValid {  get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ProductDescription { get; set; } = string.Empty;
}

