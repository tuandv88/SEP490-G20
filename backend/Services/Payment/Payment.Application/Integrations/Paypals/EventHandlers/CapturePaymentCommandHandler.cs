using BuildingBlocks.Messaging.Events.Payments.Sagas;
using BuildingBlocks.Messaging.Events.Payments.Sagas.Commands;
using MassTransit;
using Payment.Application.Data.Repositories;
using Payment.Domain.Enums;
using Payment.Domain.ValueObjects;
using PayPalCheckoutSdk.Core;
using PayPalCheckoutSdk.Orders;

namespace Payment.Application.Integrations.Paypals.EventHandlers;
public class CapturePaymentCommandHandler(ITransactionRepository transactionRepository,ITransactionItemRepository transactionItemRepository, PayPalHttpClient _payPalClient, IPublishEndpoint publishEndpoint) : IConsumer<CapturePaymentCommand> {
    public async Task Consume(ConsumeContext<CapturePaymentCommand> context) {
        var message = context.Message;

        var transaction = transactionRepository.GetAllAsQueryable().FirstOrDefault(t => t.Id.Equals(TransactionId.Of(message.TransactionId)));
        if (transaction == null || transaction.Status == TransactionStatus.Completed || transaction.Status == TransactionStatus.Failed) {
            return;
        }
        var transactionItems = transactionItemRepository.GetAllAsQueryable().Where(t => t.TransactionId.Equals(transaction.Id)).ToList();
        // rút tiền user
        var request = new OrdersCaptureRequest(transaction.ExternalOrderId);
        request.RequestBody(new OrderActionRequest());

        var response = await _payPalClient.Execute(request);
        var result = response.Result<Order>();

        if (response.StatusCode == System.Net.HttpStatusCode.Created && result.Status == "COMPLETED") {

            transaction.GrossAmount = double.Parse(result.PurchaseUnits[0].Payments.Captures[0].SellerReceivableBreakdown.GrossAmount.Value); // Tổng tiền trước khi tính phí
            transaction.FeeAmount = double.Parse(result.PurchaseUnits[0].Payments.Captures[0].SellerReceivableBreakdown.PaypalFee.Value); // Tiền phí (nếu có)
            transaction.NetAmount = double.Parse(result.PurchaseUnits[0].Payments.Captures[0].SellerReceivableBreakdown.NetAmount.Value);

            transaction.PayerId = result.Payer.PayerId; 
            transaction.PayerEmail = result.Payer.Email;

            var transactionItem = transactionItems.FirstOrDefault()!;
            transactionItem.ProductName = message.ProductName;
            transactionItem.ProductDescription = message.ProductDescription;

            transaction.Status = TransactionStatus.Completed;
            await transactionItemRepository.UpdateAsync(transactionItem);
            await transactionRepository.UpdateAsync(transaction);

            await publishEndpoint.Publish(new PaymentCapturedEvent() {
                TransactionId = message.TransactionId
            }) ;
        } else {
            transaction.Status = TransactionStatus.Failed;
            await transactionRepository.UpdateAsync(transaction);
            await publishEndpoint.Publish(new PaymentFailedEvent() {
                TransactionId = message.TransactionId
            }) ;
        }
        await transactionRepository.SaveChangesAsync();
    }
}

