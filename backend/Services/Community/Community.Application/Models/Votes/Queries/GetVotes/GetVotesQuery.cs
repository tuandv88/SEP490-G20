using Community.Application.Models.Votes.Dtos;
namespace Community.Application.Models.Votes.Queries.GetVotes
{
    public record GetVotesResult(List<VoteDto> VoteDtos);

    public record GetVotesQuery : IQuery<GetVotesResult>;
}






