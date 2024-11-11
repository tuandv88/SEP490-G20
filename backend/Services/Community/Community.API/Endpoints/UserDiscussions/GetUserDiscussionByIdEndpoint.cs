using Community.Application.Models.UserDiscussions.Dtos;
using Community.Application.Models.UserDiscussions.Queries.GetUserDiscussionById;
using Community.Application.Models.Votes.Queries.GetVoteById;

namespace Community.API.Endpoints.UserDiscussions;

public record GetUserDiscussionByIdResponse(UserDiscussionDto UserDiscussionDto);
public class GetUserDiscussionByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/userdiscussion/{id:guid}", async (Guid id, ISender sender) =>
        {
            var result = await sender.Send(new GetUserDiscussionByIdQuery(id));

            var response = result.Adapt<GetUserDiscussionByIdResponse>();

            return Results.Ok(response);
        })
        .WithName("GetUserDiscussionById")
        .Produces<GetUserDiscussionByIdResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get UserDiscussion By Id.");
    }
}