using Community.Application.Models.NotificationHistories.Queries.GetNotificationHistories;
using Community.Application.Models.NotificationHistories.Dtos;

namespace Community.API.Endpoints.NotificationHistories;

public record GetNotificationHistoriesResponse(PaginatedResult<NotificationHistoryDto> NotificationHistoryDtos);

public class GetNotificationHistoriesEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/notificationhistories", async ([AsParameters] PaginationRequest request, ISender sender) =>
        {
            var result = await sender.Send(new GetNotificationHistoriesQuery(request));

            var response = result.Adapt<GetNotificationHistoriesResponse>();

            return Results.Ok(response);
        })
        .WithName("GetNotificationHistories")
        .Produces<GetNotificationHistoriesResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get paginated Notification Histories");
    }
}
