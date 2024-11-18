using Community.Application.Models.Comments.Dtos;
using Community.Application.Models.Comments.Queries.GetCommentsPaging;

namespace Community.API.Endpoints.Comments;
public record GetCommentsResponse(PaginatedResult<CommentDto> CommentDtos);

public class GetCommentsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/comments", async ([AsParameters] PaginationRequest request, ISender sender) =>
        {
            var result = await sender.Send(new GetCommentsPagingQuery(request));

            var response = result.Adapt<GetCommentsResponse>();

            return Results.Ok(response);
        })
        .WithName("GetComments")
        .Produces<GetCommentsResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get all Comments");
    }
}
