using Community.Application.Models.Votes.Dtos;
using Community.Application.Models.Votes.Queries.GetVoteById;

namespace Community.API.Endpoints.Votes;

public record GetVoteByIdResponse(VoteDto VoteDto);
public class GetVoteByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/vote/{id:guid}", async (Guid id, ISender sender) =>
        {
            var result = await sender.Send(new GetVoteByIdQuery(id));

            var response = result.Adapt<GetVoteByIdResponse>();

            return Results.Ok(response);
        })
        .WithName("GetVoteById")
        .Produces<GetVoteByIdResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get Vote By Id");
    }
}
