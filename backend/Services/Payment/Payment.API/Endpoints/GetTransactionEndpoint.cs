using Payment.Application.Transactions.Queries.GetTransaction;
using Payment.Application.Transactions.Dtos;

namespace Payment.API.Endpoints;
public record GetTransactionResponse(int TotalPointUsed, PaginatedResult<TransactionDto> Transactions);
public class GetTransactionEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapGet("/transactions", async ([AsParameters] PaginationRequest request, ISender sender) => {
            var result = await sender.Send(new GetTransactionQuery(request));

            var response = result.Adapt<GetTransactionResponse>();

            return Results.Ok(response);

        })
        .WithName("GetTransactions")
        .Produces<GetTransactionResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get transactions");
    }
}

