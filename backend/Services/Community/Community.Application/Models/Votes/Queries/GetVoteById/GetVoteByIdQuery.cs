
using Community.Application.Models.Votes.Dtos;

namespace Community.Application.Models.Votes.Queries.GetVoteById
{
    public record GetVoteByIdResult(VoteDto VoteDto);

    public record GetVoteByIdQuery(Guid Id) : IQuery<GetVoteByIdResult>;
}
