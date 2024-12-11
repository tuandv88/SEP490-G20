using Community.Application.Models.UserDiscussions.Dtos;
using Community.Application.Models.UserDiscussions.Queries.GetUserDiscussionByUserIdAndDiscussionId;

namespace Community.API.Endpoints.UserDiscussions;
public record GetUserDiscussionByUserIdAndDiscussionIdResponse(UserDiscussionDto UserDiscussionDto);
public class GetUserDiscussionByUserIdAndDiscussionIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/userdiscussion/{userId:guid}/{discussionId:guid}", async (Guid userId, Guid discussionId, ISender sender) =>
        {
            var result = await sender.Send(new GetUserDiscussionByUserIdAndDiscussionIdQuery(userId, discussionId));

            var response = result.Adapt<GetUserDiscussionByUserIdAndDiscussionIdResponse>();

            return Results.Ok(response);
        })
        .WithName("GetUserDiscussionByUserIdAndDiscussionId")
        .Produces<GetUserDiscussionByUserIdAndDiscussionIdResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get UserDiscussion By UserId & DiscussionId.");
    }
}
