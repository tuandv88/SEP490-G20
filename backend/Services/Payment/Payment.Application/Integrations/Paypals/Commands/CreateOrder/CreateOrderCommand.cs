using BuildingBlocks.CQRS;
using FluentValidation;
using Payment.Application.Integrations.Paypals.Dtos;

namespace Payment.Application.Integrations.Paypals.Commands.CreateOrder;

public record CreateOrderCommand(CreateOrderDto Order) : ICommand<CreateOrderResult>;
public record CreateOrderResult(string OrderId);

public class CreateOrderCommandValidator : AbstractValidator<CreateOrderCommand> {
    public CreateOrderCommandValidator() {
        // Validate CreateOrderDto properties
        RuleFor(x => x.Order).NotNull().WithMessage("Order cannot be null.");

        RuleFor(x => x.Order.PaymentMethod)
            .NotEmpty().WithMessage("Payment method is required.")
            .Must(BeAValidPaymentMethod).WithMessage("Invalid payment method.");

        RuleFor(x => x.Order.Point)
            .GreaterThanOrEqualTo(0).WithMessage("Points must be zero or greater.");

        RuleFor(x => x.Order.Item)
            .NotNull().WithMessage("Item details cannot be null.");

        RuleFor(x => x.Order.Item.ProductId)
            .NotEmpty().WithMessage("Product ID is required.");

        RuleFor(x => x.Order.Item.ProductType)
            .NotEmpty().WithMessage("Product type is required.");

        RuleFor(x => x.Order.Item.Quantity)
            .GreaterThan(0).WithMessage("Quantity must be greater than zero.")
            .LessThan(2).WithMessage("Quantity must be less than 2.");

        RuleFor(x => x.Order.Item.UnitPrice)
            .GreaterThan(0).WithMessage("Unit price must be greater than zero.");
    }

    // Custom validation for payment method (if needed)
    private bool BeAValidPaymentMethod(string paymentMethod) {
        var validMethods = new[] { "Paypal" }; 
        return validMethods.Contains(paymentMethod);
    }
}
