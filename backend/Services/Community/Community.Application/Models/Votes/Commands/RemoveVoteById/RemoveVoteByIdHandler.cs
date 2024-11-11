using static MassTransit.ValidationResultExtensions;

namespace Community.Application.Models.Votes.Commands.RemoveVoteById;

public class RemoveVoteByIdHandler : ICommandHandler<RemoveVoteByIdCommand, RemoveVoteByIdResult>
{
    private readonly IVoteRepository _voteRepository;

    public RemoveVoteByIdHandler(IVoteRepository voteRepository)
    {
        _voteRepository = voteRepository;
    }

    public async Task<RemoveVoteByIdResult> Handle(RemoveVoteByIdCommand request, CancellationToken cancellationToken)
    {
        var vote = await _voteRepository.GetByIdAsync(request.VoteId);

        if (vote == null)
        {
            return new RemoveVoteByIdResult(request.VoteId, false, "Vote not found.");
        }

        await _voteRepository.DeleteByIdAsync(request.VoteId);
        await _voteRepository.SaveChangesAsync(cancellationToken);

        return new RemoveVoteByIdResult(request.VoteId, true, "Remove Successfully");
    }
}