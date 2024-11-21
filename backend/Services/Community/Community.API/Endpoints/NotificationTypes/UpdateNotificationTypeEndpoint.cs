using Community.Application.Models.NotificationTypes.Commands.UpdateNotificationType;
using Community.Application.Models.NotificationTypes.Dtos;

namespace Community.API.Endpoints.NotificationTypes;

public record UpdateNotificationTypeRequest(UpdateNotificationTypeDto UpdateNotificationTypeDto);
public record UpdateNotificationTypeResponse(bool IsSuccess);

public class UpdateNotificationTypeEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("/notificationtypes", async (UpdateNotificationTypeRequest request, ISender sender) =>
        {
            var command = request.Adapt<UpdateNotificationTypeCommand>();

            var result = await sender.Send(command);

            var response = result.Adapt<UpdateNotificationTypeResponse>();

            return Results.Ok(response);
        })
        .WithName("UpdateNotificationType")
        .Produces<UpdateNotificationTypeResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update a notification type by its ID.");
    }
}
