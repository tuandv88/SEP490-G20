using Payment.Application.Transactions.Queries.Statistics.GetMonthlyCourseSalesWithGrowth;

namespace Payment.API.Endpoints.Statistics;

public record GetMonthlyCourseSalesWithGrowthResponse(int CurrentMonthSales, double GrowthRate);

public class GetMonthlyCourseSalesWithGrowthEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/courses/monthly-sales-growth", async (ISender sender) =>
            {
                var result = await sender.Send(new GetMonthlyCourseSalesWithGrowthQuery());

                var response = result.Adapt<GetMonthlyCourseSalesWithGrowthResponse>();

                return Results.Ok(response);
            })
            .WithName("GetMonthlyCourseSalesWithGrowth")
            .Produces<GetMonthlyCourseSalesWithGrowthResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithSummary("Get Monthly Course Sales With Growth Response");
    }
}