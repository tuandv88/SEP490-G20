using Community.Application.Models.Comments.Dtos;
using Community.Application.Models.Comments.Queries.GetCommentsByIdDiscussion;

namespace Community.API.Endpoints.Comments;

public record GetCommentsByIdDiscussionResponse(PaginatedResult<CommentsDetailDto> CommentsDetailDtos);

public class GetCommentsByIdDiscussionEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/discussions/{discussionId}/comments", async (
            Guid discussionId, [AsParameters] PaginationRequest request, ISender sender) =>
        {
            var result = await sender.Send(new GetCommentsByIdDiscussionQuery(discussionId, request));

            var response = result.Adapt<GetCommentsByIdDiscussionResponse>();

            return Results.Ok(response);
        })
        .WithName("GetCommentsByIdDiscussion")
        .Produces<GetCommentsByIdDiscussionResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get comments by DiscussionId with pagination");
    }
}
