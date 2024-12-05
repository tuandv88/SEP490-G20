using BuildingBlocks.Messaging.Events.Payments.Sagas;
using BuildingBlocks.Messaging.Events.Payments.Sagas.Commands;
using MassTransit;
using Payment.Application.Data.Repositories;

namespace Payment.Application.Sagas;
public class PaymentSagaStateMachine : MassTransitStateMachine<PaymentSagaInstance> {
    // States
    public State OrderApproved { get; private set; } = default!;
    public State ProductValidated { get; private set; } = default!;
    public State PointsChecked { get; private set; } = default!;
    public State PaymentCaptured { get; private set; } = default!;
    public State NotificationSent { get; private set; } = default!;
    public State Failed { get; private set; } = default!;
    public State Completed { get; private set; } = default!;

    // Events
    public Event<OrderApprovedEvent> OrderApprovedEvent { get; private set; } = default!;
    public Event<ProductValidationEvent> ProductValidationEvent { get; private set; } = default!;
    public Event<PointsDeductedEvent> PointsDeductedEvent { get; private set; } = default!;
    public Event<PaymentCapturedEvent> PaymentCapturedEvent { get; private set; } = default!;
    public Event<PaymentSuccessEvent> PaymentSuccessEvent { get; private set; } = default!;
    public Event<EmailSentEvent> EmailSentEvent { get; private set; } = default!;

    // Failure Events
    public Event<ProductValidationFailedEvent> ProductValidationFailedEvent { get; private set; } = default!;
    public Event<PointsNotSufficientEvent> PointsNotSufficientEvent { get; private set; } = default!;
    public Event<PaymentFailedEvent> PaymentFailedEvent { get; private set; } = default!;
    public Event<EmailFailedEvent> EmailFailedEvent { get; private set; } = default!;

    private readonly ITransactionLogRepository _log;
    public PaymentSagaStateMachine(ITransactionLogRepository log) {
        _log = log;

        InstanceState(x => x.CurrentState);

        // Correlate events using CorrelationId (guid)
        Event(() => OrderApprovedEvent, x => x.CorrelateById(m => m.Message.TransactionId));
        Event(() => ProductValidationEvent, x => x.CorrelateById(m => m.Message.TransactionId));
        Event(() => PointsDeductedEvent, x => x.CorrelateById(m => m.Message.TransactionId));
        Event(() => PaymentCapturedEvent, x => x.CorrelateById(m => m.Message.TransactionId));
        Event(() => PaymentSuccessEvent, x => x.CorrelateById(m => m.Message.TransactionId));
        Event(() => EmailSentEvent, x => x.CorrelateById(m => m.Message.TransactionId));

        // Failure Events
        Event(() => ProductValidationFailedEvent, x => x.CorrelateById(m => m.Message.TransactionId));
        Event(() => PointsNotSufficientEvent, x => x.CorrelateById(m => m.Message.TransactionId));
        Event(() => PaymentFailedEvent, x => x.CorrelateById(m => m.Message.TransactionId));
        Event(() => EmailFailedEvent, x => x.CorrelateById(m => m.Message.TransactionId));

        // Order Approved -> Validate Product
        Initially(
            When(OrderApprovedEvent)
                .ThenAsync(async context => {
                    context.Saga.TransactionId = context.Message.TransactionId;
                    context.Saga.UserId = context.Message.UserId;
                    context.Saga.Currency = context.Message.Currency;
                    context.Saga.Amount = context.Message.Amount;
                    context.Saga.PaymentMethod = context.Message.PaymentMethod;
                    context.Saga.ProductId = context.Message.ProductId;
                    context.Saga.ProductType = context.Message.ProductType;
                    context.Saga.UnitPrice = context.Message.UnitPrice;
                    context.Saga.PointsUsed = context.Message.PointsUsed;
                    context.Saga.Email = context.Message.PayerEmail;
                    context.Saga.Fullname = context.Message.Fullname;
                    await _log.AddLog(context.Message.TransactionId, "OrderApprovedEvent", "Created", "Start Saga");
                })
                .TransitionTo(OrderApproved)
                .Publish(context => new ValidateProductCommand {
                    TransactionId = context.Message.TransactionId,
                    ProductId = context.Message.ProductId,
                    UserId = context.Message.UserId,
                    ProductType = context.Message.ProductType,
                    UnitPrice = context.Message.UnitPrice
                })
        );

        // Product Validation -> Deduct Points (if valid)
        During(OrderApproved,
            When(ProductValidationEvent)
                .If(context => context.Message.IsValid, x =>
                    x.TransitionTo(ProductValidated)
                      .ThenAsync(async context => {
                          context.Saga.ProductName = context.Message.ProductName;
                          context.Saga.ProductDescription = context.Message.ProductDescription;
                          await _log.AddLog(context.Message.TransactionId, "ProductValidationEvent", "Created", "ProductValidated Success");
                      })
                      .Publish(context => new DeductPointsCommand {
                          TransactionId = context.Message.TransactionId,
                          UserId = context.Saga.UserId,
                          PointsUsed = context.Saga.PointsUsed,
                          Source = "Convert points to purchase courses."
                      })
                )
                .If(context => !context.Message.IsValid, x =>
                    x.TransitionTo(Failed)
                      .ThenAsync(async context => {
                         await _log.AddLog(context.Message.TransactionId, "ProductValidationEvent", "Created", "ProductValidated Fail");
                      })
                      .Publish(context => new ProductValidationFailedEvent {
                          TransactionId = context.Saga.TransactionId,
                          // Thất bại thì chuyển transaction và fail luôn vì sản phẩm không đúng
                          //TODO
                          Reason = "Invalid product"
                      })
                )
        );


        During(ProductValidated,
            When(PointsDeductedEvent)
                .TransitionTo(PaymentCaptured)
                .Publish(context => new CapturePaymentCommand() {
                    TransactionId = context.Message.TransactionId
                }) // thu tiền user
            ,
            When(PointsNotSufficientEvent)
                .TransitionTo(Failed)
                .Publish(context => new PaymentFailedEvent {
                    TransactionId = context.Message.TransactionId,
                    Reason = "Not enough points"
                })
        );

        // Capture Payment -> Send email
        During(PaymentCaptured,
            When(PaymentCapturedEvent)
                .TransitionTo(NotificationSent)
                .ThenAsync(async context => {
                    // Phát sự kiện thanh toán thành công
                    await context.Publish(new PaymentSuccessEvent {
                        TransactionId = context.Saga.TransactionId,
                        UserId = context.Saga.UserId,
                        ProductId = context.Saga.ProductId,
                        ProductType = context.Saga.ProductType,
                    });
                })
                .Publish(context => new SendEmailNotificationCommand {
                    TransactionId = context.Message.TransactionId,
                    Fullname = context.Saga.Fullname,
                    Email = context.Saga.Email,
                    ProductName = context.Saga.ProductName,
                    ProductDescription = context.Saga.ProductDescription,
                    Amount = context.Saga.Amount
                })
        );

        // Send Email -> Complete Saga if email sent successfully
        During(NotificationSent,
            When(EmailSentEvent)
                .TransitionTo(Completed)
                .Finalize()
        );

        // Handle failures during saga steps
        DuringAny(
            When(ProductValidationFailedEvent)
                .TransitionTo(Failed)
                .Then(context => {
                    // Handle product validation failure
                }),

            When(PointsNotSufficientEvent)
                .TransitionTo(Failed)
                .Then(context => {
                    // Handle insufficient points
                }),

            When(PaymentFailedEvent)
                .TransitionTo(Failed)
                .Then(context => {
                    // Handle payment failure
                    //Send mail
                }),

            When(EmailFailedEvent)
                .TransitionTo(Failed)
                .Then(context => {
                    // Handle email sending failure
                })
        );

        // Set completed when the saga finalizes
        SetCompletedWhenFinalized();
    }

}

