using Community.Application.Models.Comments.Dtos;
using Community.Application.Models.Comments.Queries.GetCommentsByIdCommentParent;
using Community.Application.Models.Comments.Queries.GetCommentsByIdDiscussion;

namespace Community.API.Endpoints.Comments;

public record GetCommentsByIdCommentParentResponse(PaginatedResult<CommentsDetailDto> CommentsDetailDtos);

public class GetCommentsByIdCommentParentEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/discussions/{discussionId}/{commentParentId}/comments", async (
            Guid discussionId, Guid commentParentId, [AsParameters] PaginationRequest request, ISender sender) =>
        {
            var result = await sender.Send(new GetCommentsByIdCommentParentQuery(discussionId,commentParentId, request));

            var response = result.Adapt<GetCommentsByIdCommentParentResponse>();

            return Results.Ok(response);
        })
        .WithName("GetCommentsByIdCommentParent")
        .Produces<GetCommentsByIdCommentParentResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get comments by DiscussionId & CommentParentId with pagination");
    }
}

