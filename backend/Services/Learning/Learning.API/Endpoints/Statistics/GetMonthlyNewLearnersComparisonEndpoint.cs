using Learning.Application.Models.Courses.Queries.GetCourseDetails;
using Learning.Application.Models.Courses.Queries.GetStatistics.GetMonthlyNewLearnersComparison;

namespace Learning.API.Endpoints.Statistics;
public record GetMonthlyNewLearnersComparisonResponse(int CurrentMonthCount, int PreviousMonthCount, double PercentageChange);
public class GetMonthlyNewLearnersComparisonEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapGet("/statistics/learners/monthly-comparison", async (ISender sender) => {

            var result = await sender.Send(new GetMonthlyNewLearnersComparisonQuery());
            var response = result.Adapt<GetMonthlyNewLearnersComparisonResponse>();

            return Results.Ok(response);

        })
        .WithName("GetMonthlyNewLearnersComparison")
        .Produces<GetMonthlyNewLearnersComparisonResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get Monthly New Learners Comparison");
    }
}
