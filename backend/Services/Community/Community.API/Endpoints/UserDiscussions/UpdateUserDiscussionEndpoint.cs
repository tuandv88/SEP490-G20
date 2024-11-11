using Community.Application.Models.UserDiscussions.Commands.UpdateUserDiscussion;
using Community.Application.Models.UserDiscussions.Dtos;

namespace Community.API.Endpoints.UserDiscussions;

public class UpdateUserDiscussionEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("/userdiscussions", async (UpdateUserDiscussionDto updateUserDiscussionDto, ISender sender) =>
        {
            var command = new UpdateUserDiscussionCommand(updateUserDiscussionDto);
            var result = await sender.Send(command);

            if (result.IsSuccess)
            {
                return Results.Ok(new { Message = "UserDiscussion updated successfully", NewStatus = result.IsSuccess });
            }
            else
            {
                return Results.BadRequest(new { Message = "Failed to update UserDiscussion", NewStatus = result.IsSuccess });
            }
        })
        .WithName("UpdateUserDiscussion")
        .Produces(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update a UserDiscussion by its ID.");
    }
}
