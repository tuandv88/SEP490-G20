namespace BuildingBlocks.Messaging.Events.Payments.Sagas.Commands;
public record CapturePaymentCommand {
    public Guid TransactionId { get; set; }
    public string ProductName {  get; set; } = string.Empty;
    public string ProductDescription {  get; set; } = string.Empty;
}

