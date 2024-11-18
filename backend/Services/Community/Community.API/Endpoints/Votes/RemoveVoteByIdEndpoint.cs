using Community.Application.Models.Votes.Commands.RemoveVoteById;

namespace Community.API.Endpoints.Votes;

public class RemoveVoteByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapDelete("/votes/{voteId:guid}", async (Guid voteId, ISender sender, CancellationToken cancellationToken) =>
        {
            var result = await sender.Send(new RemoveVoteByIdCommand(voteId), cancellationToken);

            if (result.IsSuccess)
            {
                return Results.Ok(new { result.Id, result.Message });
            }
            else
            {
                return Results.BadRequest(new { result.Id, result.Message });
            }
        })
        .WithName("RemoveVoteById")
        .Produces(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Remove a Vote by VoteId and return success or failure message.");
    }
}
