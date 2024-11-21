using Community.Application.Models.UserNotificationSettings.Commands.UpdateUserNotificationSetting;
using Community.Application.Models.UserNotificationSettings.Dtos;

namespace Community.API.Endpoints.UserNotificationSettings;

public record UpdateUserNotificationSettingRequest(UpdateUserNotificationSettingDto UpdateUserNotificationSettingDto);
public record UpdateUserNotificationSettingResponse(bool IsSuccess);

public class UpdateUserNotificationSettingEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("/usernotificationsettings", async (UpdateUserNotificationSettingRequest request, ISender sender) =>
        {
            var command = request.Adapt<UpdateUserNotificationSettingCommand>();

            var result = await sender.Send(command);

            var response = result.Adapt<UpdateUserNotificationSettingResponse>();

            return Results.Ok(response);
        })
        .WithName("UpdateUserNotificationSetting")
        .Produces<UpdateUserNotificationSettingResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update a user notification setting by its ID.");
    }
}
