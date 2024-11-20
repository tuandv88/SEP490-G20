using Community.Application.Models.NotificationHistories.Commands.RemoveNotificationHistoryById;

namespace Community.API.Endpoints.NotificationHistories;

public class RemoveNotificationHistoryByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapDelete("/notificationhistories/{id:guid}/remove", async (Guid id, ISender sender) =>
        {
            var command = new RemoveNotificationHistoryByIdCommand(id);
            var result = await sender.Send(command);

            if (result.IsSuccess)
            {
                return Results.Ok(new { Message = "Remove Successfully!"});
            }
            else
            {
                return Results.NotFound(new { Message = "Remove Failed!" });
            }
        })
        .WithName("RemoveNotificationHistoryById")
        .Produces(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Remove a Notification History by its ID.");
    }
}


