using Community.Application.Models.Votes.Dtos;
using Community.Application.Models.Votes.Queries.GetVoteByIdDiscussion;

namespace Community.API.Endpoints.Votes;

public record GetVotesByIdDiscussionResponse(PaginatedResult<VoteDto> VoteDtos);

public class GetVotesByDiscussionByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/discussions/{discussionId}/votesbydiscussionId", async (
            Guid discussionId, [AsParameters] PaginationRequest request, ISender sender) =>
        {
            var result = await sender.Send(new GetVotesByIdDiscussionQuery(discussionId, request));

            var response = result.Adapt<GetVotesByIdDiscussionResponse>();

            return Results.Ok(response);
        })
        .WithName("GetVotesByIdDiscussion")
        .Produces<GetVotesByIdDiscussionResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get Votes by DiscussionId with pagination");
    }
}