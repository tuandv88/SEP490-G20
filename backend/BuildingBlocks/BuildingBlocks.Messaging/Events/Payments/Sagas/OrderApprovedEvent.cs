namespace BuildingBlocks.Messaging.Events.Payments.Sagas;
public record OrderApprovedEvent {
    public Guid TransactionId { get; set; }
    public Guid UserId { get; set; }
    public string Currency { get; set; }
    public string PaymentMethod { get; set; }
    public Guid ProductId { get; set; }
    public string ProductType { get; set; }
    public double UnitPrice { get; set; }
    public int PointsUsed { get; set; }
    public string PayerEmail { get; set; }
    public string Fullname { get; set; }
    public double Amount { get; set; }
}
