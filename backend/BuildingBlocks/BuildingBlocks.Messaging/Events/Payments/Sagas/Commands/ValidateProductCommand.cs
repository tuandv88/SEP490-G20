namespace BuildingBlocks.Messaging.Events.Payments.Sagas.Commands;
public record ValidateProductCommand {
    public Guid TransactionId { get; set; }
    public Guid UserId {  get; set; }
    public Guid ProductId { get; set; }
    public string ProductType { get; set; } = string.Empty;
    public double UnitPrice { get; set; }
}

