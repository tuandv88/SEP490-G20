using Payment.Application.Transactions.Commands.CancelTransaction;
using Payment.Domain.ValueObjects;

namespace Payment.API.Endpoints;

public record CancelTransactionResponse(string Message);

public class CancelTransactionEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("/transactions/{transactionId}/cancel", async (Guid transactionId, ISender sender) =>
            {
                var result = await sender.Send(new CancelTransactionCommand(transactionId));

                var response = result.Adapt<CancelTransactionResponse>();

                return Results.Ok(response);
            })
            .WithName("CancelTransaction")
            .Produces<CancelTransactionResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithSummary("Cancel Transaction");
    }
}