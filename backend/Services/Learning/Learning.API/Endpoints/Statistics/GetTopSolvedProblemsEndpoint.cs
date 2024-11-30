using Learning.Application.Models.Problems.Dtos;
using Learning.Application.Models.Problems.Queries.GetStatistics.GetTopSolvedProblems;

namespace Learning.API.Endpoints.Statistics;
public record GetTopSolvedProblemsResponse(PaginatedResult<TopSolvedProblemDto> Problems);
public class GetTopSolvedProblemsEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapGet("/statistics/problems/top-solved", async ([AsParameters] PaginationRequest request, ISender sender) => {

            var result = await sender.Send(new GetTopSolvedProblemsQuery(request));
            var response = result.Adapt<GetTopSolvedProblemsResponse>();

            return Results.Ok(response);

        })
        .WithName("GetTopSolvedProblems")
        .Produces<GetTopSolvedProblemsResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get Top Solved Problems");
    }
}