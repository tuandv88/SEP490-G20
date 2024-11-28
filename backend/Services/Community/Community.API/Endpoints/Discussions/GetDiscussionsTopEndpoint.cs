using Community.Application.Models.Discussions.Dtos;
using Community.Application.Models.Discussions.Queries.GetDiscussionsTop;

namespace Community.API.Endpoints.Discussions;

public record GetDiscussionsTopResponse(List<DiscussionsTopDto> DiscussionsTopDtos);

public class GetDiscussionsTopEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/discussions/top", async (ISender sender) =>
        {
            var result = await sender.Send(new GetDiscussionsTopQuery());

            var response = result.Adapt<GetDiscussionsTopResponse>();

            return Results.Ok(response);
        })
        .WithName("GetDiscussionsTop")
        .Produces<GetDiscussionsTopResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get top 5 latest discussions");
    }
}
