using MassTransit;

namespace Payment.Application.Sagas;
public class PaymentSagaInstance : SagaStateMachineInstance, ISagaVersion {
    public string CurrentState { get; set; } = default!;
    public string PaymentStatus { get; set; } = default!;
    public Guid UserId { get; set; }
    public double Amount { get; set; }
    public Guid TransactionId { get; set; }


    // Default props
    public Guid CorrelationId { get; set; }
    public int Version { get; set; }
}

