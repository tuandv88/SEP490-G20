using Payment.Application.Integrations.Paypals.Commands.CreateOrder;
using Payment.Application.Integrations.Paypals.Dtos;

namespace Payment.API.Endpoints;
public record CreateOrderRequest(CreateOrderDto Order);
public record CreateOrderResponse(string OrderId);
public class CreateOrderEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapPost("/checkout/orders", async (CreateOrderRequest request, ISender sender) => {
            var command = request.Adapt<CreateOrderCommand>();

            var result = await sender.Send(command);

            var response = result.Adapt<CreateOrderResponse>();

            return Results.Created($"/checkout/orders/{response.OrderId}", response);
        })
        .WithName("CreateOrder")
        .Produces<CreateOrderResponse>(StatusCodes.Status201Created)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Create order");
    }
}


