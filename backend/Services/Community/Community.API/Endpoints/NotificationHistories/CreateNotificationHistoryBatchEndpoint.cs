using Community.Application.Models.NotificationHistories.Commands.CreatesNotificationHistory;
using Community.Application.Models.NotificationHistories.Dtos;

namespace Community.API.Endpoints.NotificationHistories;

public class CreateNotificationHistoryBatchEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/notificationhistories/creates", async (CreatesNotificationHistoryDto createsNotificationHistoryDto, ISender sender) =>
        {
            var command = new CreatesNotificationHistoryCommand(createsNotificationHistoryDto);
            var result = await sender.Send(command);

            if (result.IsSuccess)
            {
                return Results.Ok(new { Message = "Notification history Multi created successfully" });
            }
            else
            {
                return Results.BadRequest(new { Message = "Notification history Multi created failed" });
            }

        })
        .WithName("CreateNotificationHistoryBatch")
        .Produces(StatusCodes.Status201Created)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Create multi new notification history entry.");
    }
}