using Community.Application.Models.NotificationHistories.Dtos;
using Community.Application.Models.NotificationHistories.Commands.CreateNotificationHistory;

namespace Community.API.Endpoints.Notifications
{
    public class CreateNotificationHistoryEndpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPost("/notificationhistory", async (CreateNotificationHistoryDto createNotificationHistoryDto, ISender sender) =>
            {
                var command = new CreateNotificationHistoryCommand(createNotificationHistoryDto);
                var result = await sender.Send(command);

                if (result.IsSuccess)
                {
                    return Results.Ok(new { Message = "Notification history created successfully" });
                }
                else
                {
                    return Results.BadRequest(new { Message = "Notification history creation failed" });
                }

        })
            .WithName("CreateNotificationHistory")
            .Produces(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .WithSummary("Create a new notification history entry.");
        }
    }
}
