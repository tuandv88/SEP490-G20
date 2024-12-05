using MassTransit;
using Payment.Domain.Enums;

namespace Payment.Application.Sagas;
public class PaymentSagaInstance : SagaStateMachineInstance, ISagaVersion {
    public string CurrentState { get; set; } = default!;
    public string PaymentStatus { get; set; } = default!;

    //User details
    public Guid UserId { get; set; }
    public string Fullname {  get; set; } = string.Empty;
    public string Email {  get; set; } = string.Empty;

    public Guid TransactionId { get; set; } // ID của giao dịch
    public Guid ProductId {  get; set; }
    public string ProductType { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public string ProductDescription { get; set; } = string.Empty;
    public double UnitPrice { get; set; }


    //
    public double Amount { get; set; }
    public string Currency { get; internal set; } = "USD";
    public string PaymentMethod { get; internal set; } = "PayPal";

    // point
    public int PointsUsed { get; set; }

    // Default props
    public Guid CorrelationId { get; set; }
    public int Version { get; set; }
    
}

