using Community.Application.Models.Votes.Commands.UpdateStatusVote;

namespace Community.API.Endpoints.Votes;
public class UpdateStatusVoteEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("/vote/{voteId:guid}/update-status", async (Guid voteId, ISender sender) =>
        {
            var command = new UpdateStatusVoteCommand(voteId);

            var result = await sender.Send(command);

            if (result.IsSuccess)
            {
                return Results.Ok(new { Message = "Update Status Vote successfully", NewStatus = result.NewStatus });
            }
            else
            {
                return Results.BadRequest(new { Message = "Update Failed status vote." });
            }
        })
        .WithName("UpdateStatusVote")
        .Produces(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update the IsActive status of a vote.");
    }
}
