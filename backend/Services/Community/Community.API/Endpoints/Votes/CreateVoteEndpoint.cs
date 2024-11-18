using Community.Application.Models.Votes.Commands.CreateVote;
using Community.Application.Models.Votes.Dtos;

namespace Community.API.Endpoints.Votes;

public class CreateVoteEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/votes", async (CreateVoteDto createVoteDto, ISender sender) =>
        {
            var command = new CreateVoteCommand(createVoteDto);

            var result = await sender.Send(command);

            if (result.IsSuccess)
            {
                return Results.Ok(new { Message = "Create Vote successfully", NewStatus = result.IsSuccess });
            }
            else
            {
                return Results.BadRequest(new { Message = "Create Vote Failed", NewStatus = result.IsSuccess });
            }
        })
        .WithName("CreateVote")
        .Produces(StatusCodes.Status201Created)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Create a new vote.");
    }
}
