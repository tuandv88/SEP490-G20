using Learning.Application.Models.Problems.Queries.GetStatistics.GetMonthlyProblemSubmissionsComparison;

namespace Learning.API.Endpoints.Statistics;

public record GetMonthlyProblemSubmissionsComparisonResponse(int CurrentMonthCount, int PreviousMonthCount, double PercentageChange);
public class GetMonthlyProblemSubmissionsComparisonEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapGet("/statistics/problems/submissions/monthly-comparison", async (ISender sender) => {

            var result = await sender.Send(new GetMonthlyProblemSubmissionsComparisonQuery());
            var response = result.Adapt<GetMonthlyProblemSubmissionsComparisonResponse>();

            return Results.Ok(response);

        })
        .WithName("GetMonthlyProblemSubmissionsComparison")
        .Produces<GetMonthlyProblemSubmissionsComparisonResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get Monthly Problem Submissions Comparison");
    }
}