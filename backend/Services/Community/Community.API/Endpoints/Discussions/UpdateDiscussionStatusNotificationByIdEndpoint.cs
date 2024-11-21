using Community.Application.Models.Discussions.Commands.UpdateDiscussionStatusNotification;

namespace Community.API.Endpoints.Discussions;

public class UpdateDiscussionStatusNotificationByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("/discussion/{Id:guid}/update-status-notification", async (Guid Id, ISender sender) =>
        {
            var command = new UpdateDiscussionStatusNotificationByIdCommand(Id);

            var result = await sender.Send(command);

            if (result.IsSuccess)
            {
                return Results.Ok(new { Message = "Update Status Notification Discussion successfully", NewStatus = result.NewStatus });
            }
            else
            {
                return Results.BadRequest(new { Message = "Update Failed Status Notification Discussion." });
            }
        })
        .WithName("UpdateDiscussionStatusNotificationById")
        .Produces(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update Notification status of a Discussion.");
    }
}
