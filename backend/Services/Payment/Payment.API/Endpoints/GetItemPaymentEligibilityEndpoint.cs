using Payment.Application.Transactions.Queries.GetItemPaymentEligibility;

namespace Payment.API.Endpoints;

public record GetItemPaymentEligibilityResponse(bool IsAccepted);

public class GetItemPaymentEligibilityEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/items/{productId}/payment-eligibility", async (string productId, ISender sender) =>
            {
                var result = await sender.Send(new GetItemPaymentEligibilityQuery(productId));

                var response = result.Adapt<GetItemPaymentEligibilityResponse>();

                return Results.Ok(response);
            })
            .WithName("GetItemPaymentEligibility")
            .Produces<GetItemPaymentEligibilityResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithSummary("Get Item Payment Eligibility");
    }
}