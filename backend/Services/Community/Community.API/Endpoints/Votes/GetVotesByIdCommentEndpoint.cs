using Community.Application.Models.Votes.Dtos;
using Community.Application.Models.Votes.Queries.GetVoteByIdDiscussion;
using Community.Application.Models.Votes.Queries.GetVotesByIdComment;

namespace Community.API.Endpoints.Votes;

public record GetVotesByIdCommentResponse(PaginatedResult<VoteDto> VoteDtos);

public class GetVotesByIdCommentEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/discussions/{commentId}/votesbycommentId", async (
            Guid commentId, [AsParameters] PaginationRequest request, ISender sender) =>
        {
            var result = await sender.Send(new GetVotesByIdCommentQuery(commentId, request));

            var response = result.Adapt<GetVotesByIdCommentResponse>();

            return Results.Ok(response);
        })
        .WithName("GetVotesByIdComment")
        .Produces<GetVotesByIdDiscussionResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get Votes by Comment Id with pagination");
    }
}
