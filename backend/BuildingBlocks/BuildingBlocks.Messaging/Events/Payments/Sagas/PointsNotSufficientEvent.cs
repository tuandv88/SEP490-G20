namespace BuildingBlocks.Messaging.Events.Payments.Sagas;
public record PointsNotSufficientEvent {
    public Guid TransactionId { get; set; }
}

