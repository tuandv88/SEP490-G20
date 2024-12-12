
using Community.Application.Models.UserDiscussions.Queries.GetUserIdsWithNotificationsEnabled;

namespace Community.API.Endpoints.UserDiscussions;

public record GetUserIdsWithNotificationsEnabledResponse(List<Guid> UserIds);

public class GetUserIdsWithNotificationsEnabledEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/userdiscussions/{discussionId:guid}/notifications-enabled", async (Guid discussionId, ISender sender) =>
        {
            var query = new GetUserIdsWithNotificationsEnabledQuery(discussionId);
            var result = await sender.Send(query);

            var response = result.Adapt<GetUserIdsWithNotificationsEnabledResponse>();

            return Results.Ok(response);
        })
        .WithName("GetUserIdsWithNotificationsEnabled")
        .Produces<GetUserIdsWithNotificationsEnabledResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get User IDs with Notifications Enabled for a Discussion.");
    }
}
