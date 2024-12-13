using BuildingBlocks.CQRS;
using MediatR;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Payment.Application.Data.Repositories;
using Payment.Application.Interfaces;
using Payment.Application.Transactions.Queries.GetItemPaymentEligibility;
using Payment.Domain.Models;
using Payment.Domain.ValueObjects;
using PayPalCheckoutSdk.Core;
using PayPalCheckoutSdk.Orders;

namespace Payment.Application.Integrations.Paypals.Commands.CreateOrder;
public class CreateOrderHandler(PayPalHttpClient payPalHttpClient, IUserContextService userContext, ITransactionRepository transactionRepository,
    ITransactionItemRepository transactionItemRepository, ILogger<CreateOrderHandler> logger, ISender sender) : ICommandHandler<CreateOrderCommand, CreateOrderResult> {
    public async Task<CreateOrderResult> Handle(CreateOrderCommand request, CancellationToken cancellationToken) {
        var order = request.Order;

        var eligibilityResult = await sender.Send(new GetItemPaymentEligibilityQuery(order.Item.ProductId), cancellationToken);
        if (!eligibilityResult.IsAccepted)
        {
            return new CreateOrderResult(null!);
        }
        if (!Enum.TryParse(order.PaymentMethod, true, out Domain.Enums.PaymentMethod paymentMethod) && paymentMethod != Domain.Enums.PaymentMethod.Paypal) {
            throw new InvalidOperationException("Unsupported payment method");
        }
        var user = userContext.User;
        var purchaseUnits = new List<PurchaseUnitRequest>();
        var userId = user.Id;
        var email = user.Email;
        var fullname = $"{user.FirstName} {user.LastName}";
        var itemAmount = order.Item.Quantity * order.Item.UnitPrice;
        var rootItemAmount = itemAmount;
        var point = order.Point;
        if (!Enum.TryParse(order.Item.ProductType, true, out Domain.Enums.ProductType productType) && productType != Domain.Enums.ProductType.Course) {
            throw new InvalidOperationException("Unsupported ProductType");
        }

        double discount = 0;
        if (point > 0) {
            discount = Math.Round(point / 1000.0, 2); // 1000 points = 1 dollar discount, rounded to 2 decimal places
            discount = Math.Min(discount, itemAmount);
            itemAmount = Math.Max(0, Math.Round(itemAmount - discount, 2)); // Ensure the result is also rounded to 2 decimal places
        }

        purchaseUnits.Add(new PurchaseUnitRequest {
            AmountWithBreakdown = new AmountWithBreakdown {
                CurrencyCode = "USD",
                Value = itemAmount.ToString("F2")
            },
            CustomId = $"{userId}_{order.Item.ProductId}",
            Description = productType.ToString(),
        });
        
        var orderRequest = new OrderRequest {
            CheckoutPaymentIntent = "CAPTURE",
            PurchaseUnits = purchaseUnits,
            ApplicationContext = new ApplicationContext {
                UserAction = "PAY_NOW",
                BrandName = "ICoderVN",
                LandingPage = "BILLING"
            }
        };

        var orderCreateRequest = new OrdersCreateRequest();
        orderCreateRequest.Prefer("return=representation");
        orderCreateRequest.RequestBody(orderRequest);
        var response = await payPalHttpClient.Execute(orderCreateRequest);
        var result = response.Result<Order>();

        // Create the Transaction entity and save it
        var transactionId = TransactionId.Of(Guid.NewGuid());
        var transaction = new Transaction {
            Id = transactionId,
            UserId = UserId.Of(userId),
            Amount = rootItemAmount,
            Currency = "USD",
            Status = Domain.Enums.TransactionStatus.Created,
            PaymentMethod = paymentMethod,
            ExternalOrderId = result.Id,
            ExternalTransactionId = result.Id,
            PointsUsed = (int)(discount * 1000),
            DiscountAmount = discount,
            PayerEmail = email,
            Fullname = fullname,
        };
        var transactionItem = new TransactionItem {
            Id = TransactionItemId.Of(Guid.NewGuid()),
            TransactionId = transactionId,
            ProductId = order.Item.ProductId,
            ProductType = productType,
            ProductName = order.Item.ProductName,
            Quantity = order.Item.Quantity,
            UnitPrice = order.Item.UnitPrice
        };
        await transactionItemRepository.AddAsync(transactionItem);
        await transactionRepository.AddAsync(transaction);
        await transactionRepository.SaveChangesAsync(cancellationToken);

        return new CreateOrderResult(result.Id);
    }
}

