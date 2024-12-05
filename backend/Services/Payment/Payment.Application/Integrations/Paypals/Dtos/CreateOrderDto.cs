namespace Payment.Application.Integrations.Paypals.Dtos;
public record CreateOrderDto(
    string PaymentMethod,
    int Point,
    CreateOrderItem Item
);

public record CreateOrderItem(
    string ProductId,
    string ProductType,
    int Quantity,
    double UnitPrice
);
