namespace BuildingBlocks.Messaging.Events.Payments.Sagas.Commands;
public record CapturePaymentCommand {
    public Guid TransactionId { get; set; }
}

