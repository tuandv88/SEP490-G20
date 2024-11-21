using Community.Application.Models.NotificationTypes.Commands.RemoveNotificationTypeById;

namespace Community.API.Endpoints.NotificationTypes;
public class RemoveNotificationTypeByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapDelete("/notificationhtypes/{id:guid}/remove", async (Guid id, ISender sender) =>
        {
            var command = new RemoveNotificationTypeByIdCommand(id);
            var result = await sender.Send(command);

            if (result.IsSuccess)
            {
                return Results.Ok(new { Message = "Remove Successfully!" });
            }
            else
            {
                return Results.NotFound(new { Message = "Remove Failed!" });
            }
        })
        .WithName("RemoveNotificationTypeById")
        .Produces(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Remove a Notification Type by its ID.");
    }
}
