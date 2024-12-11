namespace BuildingBlocks.Messaging.Events.Payments.Sagas.Commands;

public record SetTransactionFailedCommand {
     public Guid TransactionId { get; set; }
}