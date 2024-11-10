namespace Community.Application.Models.Votes.Commands.UpdateStatusVote;

public class UpdateStatusVoteHandler : ICommandHandler<UpdateStatusVoteCommand, UpdateStatusVoteResult>
{
    private readonly IVoteRepository _voteRepository;

    public UpdateStatusVoteHandler(IVoteRepository voteRepository)
    {
        _voteRepository = voteRepository;
    }

    public async Task<UpdateStatusVoteResult> Handle(UpdateStatusVoteCommand request, CancellationToken cancellationToken)
    {
        var vote = await _voteRepository.GetByIdAsync(request.VoteId);

        if (vote == null)
        {
            throw new NotFoundException("Vote not found.", request.VoteId);
        }

        // Chuyển đổi trạng thái IsActive
        vote.IsActive = !vote.IsActive;

        await _voteRepository.UpdateAsync(vote);
        await _voteRepository.SaveChangesAsync(cancellationToken);

        return new UpdateStatusVoteResult(true, vote.IsActive);
    }
}
