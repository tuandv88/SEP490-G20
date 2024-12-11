using Payment.Application.Transactions.Dtos;
using Payment.Application.Transactions.Queries.GetTransactionAudit;

namespace Payment.API.Endpoints;

public record GetTransactionAuditResponse(PaginatedResult<TransactionAuditDto> Transactions);

public class GetTransactionAuditEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/transactions/audits", async ([AsParameters] PaginationRequest request,
                [AsParameters] GetTransactionAuditFilter filter, ISender sender) =>
            {
                var result = await sender.Send(new GetTransactionAuditQuery(request, filter));

                var response = result.Adapt<GetTransactionAuditResponse>();

                return Results.Ok(response);
            })
            .WithName("GetTransactionsAudit")
            .Produces<GetTransactionAuditResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithSummary("Get transactions audit");
    }
}