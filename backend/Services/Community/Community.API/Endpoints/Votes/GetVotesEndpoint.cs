using Community.Application.Models.Votes.Dtos;
using Community.Application.Models.Votes.Queries.GetVotes;

namespace Community.API.Endpoints.Votes;

public record GetVotesResponse(List<VoteDto> VoteDtos);         

public class GetVotesEndpoint : ICarterModule                         
{
    public void AddRoutes(IEndpointRouteBuilder app)                        
    {
        app.MapGet("/votes", async (ISender sender) =>                 
        {
            var result = await sender.Send(new GetVotesQuery());

            var response = result.Adapt<GetVotesResponse>();

            return Results.Ok(response);
        })
        .WithName("GetVotes")
        .Produces<GetVotesResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get all Votes");
    }
}
