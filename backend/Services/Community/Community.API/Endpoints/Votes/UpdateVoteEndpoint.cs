using Community.Application.Models.Votes.Commands.UpdateVote;
using Community.Application.Models.Votes.Dtos;

namespace Community.API.Endpoints.Votes;

public record UpdateVoteRequest(UpdateVoteDto UpdateVoteDto);
public record UpdateVoteResponse(bool IsSuccess);

public class UpdateVoteEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("/votes", async (UpdateVoteRequest request, ISender sender) =>
        {
            var command = request.Adapt<UpdateVoteCommand>();

            var result = await sender.Send(command);

            var response = result.Adapt<UpdateVoteResponse>();

            return Results.Ok(response);
        })
        .WithName("UpdateVote")
        .Produces<UpdateVoteResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update a vote by its ID.");
    }
}
