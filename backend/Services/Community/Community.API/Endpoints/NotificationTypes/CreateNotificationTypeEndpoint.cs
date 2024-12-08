using Community.Application.Models.NotificationTypes.Commands.CreateNotificationType;
using Community.Application.Models.NotificationTypes.Dtos;

namespace Community.API.Endpoints.Notifications
{
    public class CreateNotificationTypeEndpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPost("/notificationtypes/create", async (CreateNotificationTypeDto createNotificationTypeDto, ISender sender) =>
            {
                var command = new CreateNotificationTypeCommand(createNotificationTypeDto);

                var result = await sender.Send(command);

                if (result.IsSuccess)
                {
                    return Results.Ok(new { Message = "Notification type created successfully", NewStatus = result.IsSuccess });
                }
                else
                {
                    return Results.BadRequest(new { Message = "Notification type creation failed", NewStatus = result.IsSuccess });
                }
            })
            .WithName("CreateNotificationType")
            .Produces(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .WithSummary("Create a new notification type.");
        }
    }
}
