using Community.Application.Models.UserNotificationSettings.Commands.RemoveUserNotificationSettingById;

namespace Community.API.Endpoints.UserNotificationSettings;

public class RemoveUserNotificationSettingByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapDelete("/usernotificationsettings/{id:guid}/remove", async (Guid id, ISender sender) =>
        {
            var command = new RemoveUserNotificationSettingByIdCommand(id);
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
        .WithName("RemoveUserNotificationSettingById")
        .Produces(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Remove a User Notification Setting by its ID.");
    }
}
