using Learning.Application.Models.Problems.Dtos;
using Learning.Application.Models.Problems.Queries.GetLeaderboard;

namespace Learning.API.Endpoints.Problems;
public record GetLeaderboardResponse(PaginatedResult<UserRankDto> Ranks);
public class GetLeaderboardEndpont : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapGet("/problems/leadboards", async ([AsParameters] PaginationRequest request,[AsParameters] GetLeaderboardFilter filter, ISender sender) => {
            var result = await sender.Send(new GetLeaderboardQuery(request, filter));

            var response = result.Adapt<GetLeaderboardResponse>();

            return Results.Ok(response);

        })
       .WithName("GetProblemsLeadboards")
       .Produces<GetLeaderboardResponse>(StatusCodes.Status200OK)
       .ProducesProblem(StatusCodes.Status400BadRequest)
       .ProducesProblem(StatusCodes.Status404NotFound)
       .WithSummary("Get Problems leadboards");
    }
}

