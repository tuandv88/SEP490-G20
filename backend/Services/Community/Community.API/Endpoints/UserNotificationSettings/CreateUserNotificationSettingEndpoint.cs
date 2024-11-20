using Community.Application.Models.UserNotificationSettings.Dtos;
using Community.Application.Models.UserNotificationSettings.Commands.CreateUserNotificationSetting;

namespace Community.API.Endpoints.UserNotificationSettings
{
    public class CreateUserNotificationSettingEndpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPost("/usernotificationsetting", async (CreateUserNotificationSettingDto createUserNotificationSettingDto, ISender sender) =>
            {
                var command = new CreateUserNotificationSettingCommand(createUserNotificationSettingDto);
                var result = await sender.Send(command);

                if (result.IsSuccess)
                {
                    return Results.Ok(new { Message = "User notification setting created successfully" });
                }
                else
                {
                    return Results.BadRequest(new { Message = "User notification setting creation failed" });
                }
            })
            .WithName("CreateUserNotificationSetting")
            .Produces(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .WithSummary("Create a new user notification setting.");
        }
    }
}
