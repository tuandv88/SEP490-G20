using Community.Application.Models.NotificationHistories.Dtos;
using Community.Application.Models.Notifications.Commands.UpdateNotificationHistory;

namespace Community.API.Endpoints.NotificationHistories;

public record UpdateNotificationHistoryRequest(UpdateNotificationHistoryDto UpdateNotificationHistoryDto);
public record UpdateNotificationHistoryResponse(bool IsSuccess);

public class UpdateNotificationHistoryEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("/notificationhistories", async (UpdateNotificationHistoryRequest request, ISender sender) =>
        {
            var command = request.Adapt<UpdateNotificationHistoryCommand>();

            var result = await sender.Send(command);

            var response = result.Adapt<UpdateNotificationHistoryResponse>();

            return Results.Ok(response);
        })
        .WithName("UpdateNotificationHistory")
        .Produces<UpdateNotificationHistoryResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update a notification history by its ID.");
    }
}
