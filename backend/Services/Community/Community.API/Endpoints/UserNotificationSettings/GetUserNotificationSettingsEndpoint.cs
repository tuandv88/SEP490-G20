using Community.Application.Models.NotificationHistories.Queries.GetNotificationHistories;
using Community.Application.Models.UserNotificationSettings.Dtos;
using Community.Application.Models.UserNotificationSettings.Queries.GetUserNotificationSettings;

namespace Community.API.Endpoints.UserNotificationSettings;
public record GetUserNotificationSettingsResponse(PaginatedResult<UserNotificationSettingDto> UserNotificationSettingDtos);

public class GetUserNotificationSettingsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/usernotificationsettings", async ([AsParameters] PaginationRequest request, ISender sender) =>
        {
            var result = await sender.Send(new GetUserNotificationSettingsQuery(request));

            var response = result.Adapt<GetUserNotificationSettingsResponse>();

            return Results.Ok(response);
        })
        .WithName("GetUserNotificationSettings")
        .Produces<GetUserNotificationSettingsResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get paginated Notification User Settings");
    }
}

