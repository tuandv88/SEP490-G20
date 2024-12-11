using BuildingBlocks.CQRS;
using BuildingBlocks.Messaging.Events.Payments.Sagas;
using MassTransit;
using MediatR;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Payment.Application.Commons.Paypals;
using Payment.Application.Commons.Paypals.Models;
using Payment.Application.Data.Repositories;
using Payment.Application.Interfaces;

namespace Payment.Application.Integrations.Paypals.Commands.ApproveOrder;
public class ApproveOrderHandler(IPaypalClientApi paypalClientApi, ITransactionRepository transactionRepository,ITransactionItemRepository transactionItemRepository, IPublishEndpoint publishEndpoint,
    ILogger<ApproveOrderHandler> logger) : ICommandHandler<ApproveOrderCommand, Unit> {
    public async Task<Unit> Handle(ApproveOrderCommand request, CancellationToken cancellationToken) {
        var header = request.Headers;
        var body = request.Body;
        var isValidEvent = await paypalClientApi.VerifyEvent(header, body);

        if (isValidEvent) {
            var webhookEvent = JsonConvert.DeserializeObject<WebHookEvent>(body)!;
            logger.LogDebug(webhookEvent.ToString());
            switch (webhookEvent.EventType) {
                case EventTypeConstant.CheckoutOrderApproved:
                    var data = webhookEvent.GetResource<CheckoutOrderResource>();
                    await HandlerEvent(data);
                    break;
            }
        }
        return Unit.Value;
    }
    private async Task HandlerEvent(CheckoutOrderResource checkoutOrder) {
        var transaction = transactionRepository.GetAllAsQueryable().FirstOrDefault(t => t.ExternalOrderId.Equals(checkoutOrder.Id));
        
        if (transaction == null || transaction.Status != Domain.Enums.TransactionStatus.Created) {
            return;
        }
        var transactionItem = transactionItemRepository.GetAllAsQueryable().Where(t => t.TransactionId.Equals(transaction.Id)).ToList();
        await publishEndpoint.Publish(new OrderApprovedEvent() {
            TransactionId = transaction.Id.Value,
            UserId = transaction.UserId.Value,
            Currency = transaction.Currency,
            PaymentMethod = transaction.PaymentMethod.ToString(),
            ProductId = Guid.Parse(transactionItem.FirstOrDefault()!.ProductId),
            ProductType = transactionItem.FirstOrDefault()!.ProductType.ToString(),
            UnitPrice = transactionItem.FirstOrDefault()!.UnitPrice,
            PointsUsed = transaction.PointsUsed,
            PayerEmail = transaction.PayerEmail!,
            Fullname = transaction.Fullname,
            Amount = transaction.Amount - transaction.DiscountAmount
        });
        await transactionRepository.SaveChangesAsync();
    }
}

