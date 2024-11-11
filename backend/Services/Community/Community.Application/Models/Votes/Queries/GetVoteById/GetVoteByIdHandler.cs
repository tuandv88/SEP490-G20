using Community.Application.Extensions;
using Community.Application.Models.Votes.Queries.GetVoteById;

namespace Community.Application.Models.Votes.Queries.GetVoteById
{
    public class GetVoteByIdHandler : IQueryHandler<GetVoteByIdQuery, GetVoteByIdResult>
    {
        private readonly IVoteRepository _repository;

        public GetVoteByIdHandler(IVoteRepository repository)
        {
            _repository = repository;
        }

        public async Task<GetVoteByIdResult> Handle(GetVoteByIdQuery query, CancellationToken cancellationToken)
        {
            var vote = await _repository.GetByIdAsync(query.Id);

            if (vote == null)
            {
                return new GetVoteByIdResult(null);
            }

            var voteDto = vote?.ToVoteDto();

            return new GetVoteByIdResult(voteDto);
        }
    }
}
