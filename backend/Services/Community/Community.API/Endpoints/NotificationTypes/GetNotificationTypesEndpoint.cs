using Community.Application.Models.NotificationTypes.Dtos;
using Community.Application.Models.NotificationTypes.Queries.GetNotificationTypesPaging;

namespace Community.API.Endpoints.NotificationTypes;

public record GetNotificationTypesResponse(PaginatedResult<NotificationTypeDto> NotificationTypeDtos);

public class GetNotificationTypesEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/notificationtypes", async ([AsParameters] PaginationRequest request, ISender sender) =>
        {
            var result = await sender.Send(new GetNotificationTypesPagingQuery(request));

            var response = result.Adapt<GetNotificationTypesResponse>();

            return Results.Ok(response);
        })
        .WithName("GetNotificationTypes")
        .Produces<GetNotificationTypesResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get all Notification Types");
    }
}
