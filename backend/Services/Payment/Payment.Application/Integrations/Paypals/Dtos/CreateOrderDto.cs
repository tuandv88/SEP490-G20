namespace Payment.Application.Integrations.Paypals.Dtos;
public record CreateOrderDto(
    string PaymentMethod,
    int Point,
    CreateOrderItem Item
);

public record CreateOrderItem(
    string ProductId,
    string ProductName,
    string ProductType,
    int Quantity,
    double UnitPrice
);
