namespace BuildingBlocks.Messaging.Events.Payments.Sagas.Commands;

public record RefundPointsCommand
{
    public Guid TransactionId { get; set; }
    public Guid UserId { get; set; }
    public int PointsUsed { get; set; }
    public string Source { get; set; } = string.Empty;
}