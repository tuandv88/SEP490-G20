using Community.Application.Models.Discussions.Queries.GetDiscussionById;
using Community.Application.Models.Discussions.Dtos;

namespace Community.API.Endpoints.Discussions;

public record GetDiscussionByIdResponse(DiscussionDto DiscussionDto);
public class GetDiscussionByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/discussion/{id:guid}", async (Guid id, ISender sender) =>
        {
            var result = await sender.Send(new GetDiscussionByIdQuery(id));

            var response = result.Adapt<GetDiscussionByIdResponse>();

            return Results.Ok(response);
        })
        .WithName("GetDiscussionById")
        .Produces<GetDiscussionByIdResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get Discussion By Id");
    }
}
