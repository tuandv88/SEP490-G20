using MassTransit;

namespace Payment.Application.Sagas;
public class PaymentSagaInstance : SagaStateMachineInstance, ISagaVersion {
    public string CurrentState { get; set; } = default!;
    public string PaymentStatus { get; set; } = default!;

    //User details
    public Guid UserId { get; set; }
    public string Fullname {  get; set; } = string.Empty;
    public string Email {  get; set; } = string.Empty;

    public Guid TransactionId { get; set; } // ID của giao dịch
    public double TotalAmount { get; set; }

    // Default props
    public Guid CorrelationId { get; set; }
    public int Version { get; set; }
}

