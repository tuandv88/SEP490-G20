using Community.Application.Models.Discussions.Commands.UpdateDiscussionStatusNotification;
using Community.Application.Models.UserDiscussions.Commands.UpdateUserDiscusisonStatusNotification;

namespace Community.API.Endpoints.UserDiscussions;

public class UpdateUserDiscusisonStatusNotificationEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("/userdiscussions/{UserId:guid}/{DiscussionId:guid}/update-status-notification", async (Guid UserId, Guid DiscussionId, ISender sender) =>
        {
            var command = new UpdateUserDiscusisonStatusNotificationCommand(UserId, DiscussionId);

            var result = await sender.Send(command);

            if (result.IsSuccess)
            {
                return Results.Ok(new { Message = "Update Status Notification a User Discussion successfully", NewStatus = result.NewStatus });
            }
            else
            {
                return Results.BadRequest(new { Message = "Update Failed Status Notification Discussion." });
            }
        })
        .WithName("UpdateUserDiscusisonStatusNotification")
        .Produces(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update Notification status of a User Discussion.");
    }
}

