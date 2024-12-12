using Payment.Application.Transactions.Queries.Statistics.GetMonthlyRevenueWithGrowth;

namespace Payment.API.Endpoints.Statistics;

public record GetMonthlyRevenueWithGrowthResponse(double TotalRevenue, double GrowthRate);
public class GetMonthlyRevenueWithGrowthEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/revenue/monthly-growth", async (ISender sender) =>
            {
                var result = await sender.Send(new GetMonthlyRevenueWithGrowthQuery());

                var response = result.Adapt<GetMonthlyRevenueWithGrowthResponse>();

                return Results.Ok(response);
            })
            .WithName("GetMonthlyRevenueWithGrowth")
            .Produces<GetMonthlyRevenueWithGrowthResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithSummary("Get Monthly Revenue With Growth");
    }
}