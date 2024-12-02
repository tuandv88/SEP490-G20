using Community.Application.Models.NotificationHistories.Dtos;
using Community.Application.Models.NotificationHistories.Queries.GetNotificationHistoriesDetail;

namespace Community.API.Endpoints.NotificationHistories;

public record GetNotificationHistoriesDetailByUserIdResponse(PaginatedResult<NotificationHistoryDetailDto> NotificationHistoryDetailDtos);

public class GetNotificationHistoriesDetailByUserIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/notificationhistories/detail", async ([AsParameters] PaginationRequest request, ISender sender) =>
        {
            var result = await sender.Send(new GetNotificationHistoriesDetailByUserIdQuery(request));

            var response = result.Adapt<GetNotificationHistoriesDetailByUserIdResponse>();

            return Results.Ok(response);
        })
        .WithName("GetNotificationHistoriesDetailByUserId")
        .Produces<GetNotificationHistoriesDetailByUserIdResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get paginated Notification Histories Detail By User Id");
    }
}

