using Carter;
using MediatR;
using Payment.Application.Integrations.Paypals.Commands.ApproveOrder;

namespace Payment.API.Endpoints;
public class PaypalWebhookEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapPost("/checkout/paypal/webhook", async (HttpRequest request, ISender sender) => {
            var body = await new StreamReader(request.Body).ReadToEndAsync();
            var headers = request.Headers;
            var result = await sender.Send(new ApproveOrderCommand(headers, body));

            return Results.NoContent();
        })
        .WithName("CaptureOrder")
        .Produces(StatusCodes.Status204NoContent)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Capture order");
    }
}
