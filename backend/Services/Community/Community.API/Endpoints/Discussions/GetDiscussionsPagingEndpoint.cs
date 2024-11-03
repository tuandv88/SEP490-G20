using BuildingBlocks.Pagination;
using Community.Application.Models.Discussions.Queries.GetDiscussionsPaging;
using Community.Application.Models.Discussions.Dtos;

namespace Community.API.Endpoints.Discussions;
public record GetDiscussionsPagingResponse(PaginatedResult<DiscussionDto> DiscussionDtos);
public class GetDiscussionsPagingsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/discussionspaging", async ([AsParameters] PaginationRequest request, ISender sender) =>
        {
            var result = await sender.Send(new GetDiscussionsPagingQuery(request));

            var response = result.Adapt<GetDiscussionsPagingResponse>();

            return Results.Ok(response);
        })
        .WithName("GetDiscussionsPaging")
        .Produces<GetDiscussionsPagingResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get Discussions with Pagination");
    }
}
