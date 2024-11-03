using Community.Application.Extensions;

namespace Community.Application.Models.Votes.Queries.GetVotes
{
    public class GetVotesHandler : IQueryHandler<GetVotesQuery, GetVotesResult>
    {
        private readonly IVoteRepository _repository;

        public GetVotesHandler(IVoteRepository repository) 
        {
            _repository = repository; 
        }

        public async Task<GetVotesResult> Handle(GetVotesQuery query, CancellationToken cancellationToken)
        {
            var votes = await _repository.GetAllAsync();

            var voteDtos = votes.Select(v => v.ToVoteDto()).ToList();

            return new GetVotesResult(voteDtos);

        }
    }
}


