namespace BuildingBlocks.Messaging.Events.Payments.Sagas;
public record PointsDeductedEvent {
    public Guid TransactionId { get; set; }
}

