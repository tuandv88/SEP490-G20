using MassTransit;

namespace Payment.Application.Sagas;
public class PaymentSagaInstance : SagaStateMachineInstance, ISagaVersion {
    public string CurrentState { get; set; } = default!;

    //User details
    public Guid UserId { get; set; }
    public string Fullname {  get; set; } = string.Empty;
    public string Email {  get; set; } = string.Empty;

    //Order details
    public string OrderId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal Discount { get; set; }
    public string PayPalOrderId { get; set; } = string.Empty;

    // Default props
    public Guid CorrelationId { get; set; }
    public int Version { get; set; }
}

