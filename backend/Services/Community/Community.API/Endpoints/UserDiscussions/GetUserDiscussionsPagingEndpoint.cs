using Community.Application.Models.UserDiscussions.Dtos;
using Community.Application.Models.UserDiscussions.Queries.GetUserDiscussionsPaging;

namespace Community.API.Endpoints.UserDiscussions;

public record GetUserDiscussionsPagingResponse(PaginatedResult<UserDiscussionDto> UserDiscussionDtos);
public class GetUserDiscussionsPagingEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/userdiscussions", async ([AsParameters] PaginationRequest request, ISender sender) =>
        {
            var result = await sender.Send(new GetUserDiscussionsPagingQuery(request));

            var response = result.Adapt<GetUserDiscussionsPagingResponse>();

            return Results.Ok(response);
        })
        .WithName("GetUserDiscussions")
        .Produces<GetUserDiscussionsPagingResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get UserDiscussions with Pagination");
    }
}
