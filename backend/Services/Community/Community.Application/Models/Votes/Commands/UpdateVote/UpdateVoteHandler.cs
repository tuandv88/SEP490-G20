using Community.Application.Models.Votes.Dtos;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Community.Application.Models.Votes.Commands.UpdateVote;

public class UpdateVoteHandler : ICommandHandler<UpdateVoteCommand, UpdateVoteResult>
{
    private readonly IVoteRepository _voteRepository;

    public UpdateVoteHandler(IVoteRepository voteRepository)
    {
        _voteRepository = voteRepository;
    }

    public async Task<UpdateVoteResult> Handle(UpdateVoteCommand request, CancellationToken cancellationToken)
    {
        var vote = await _voteRepository.GetByIdAsync(request.UpdateVoteDto.Id);

        if (vote == null)
        {
            throw new NotFoundException("Vote not found.", request.UpdateVoteDto.Id);
        }

        UpdateVoteWithNewValues(vote, request.UpdateVoteDto);

        await _voteRepository.UpdateAsync(vote);
        await _voteRepository.SaveChangesAsync(cancellationToken);

        return new UpdateVoteResult(true);
    }

    private void UpdateVoteWithNewValues(Vote vote, UpdateVoteDto updateVoteDto)
    {
        var voteType = Enum.TryParse<VoteType>(updateVoteDto.VoteType, out var type)
            ? type : throw new ArgumentOutOfRangeException(nameof(updateVoteDto.VoteType), $"Value '{updateVoteDto.VoteType}' is not valid for VoteType.");

        var dateVoted = DateTime.TryParse(updateVoteDto.DateVoted, out var parsedDate)
            ? parsedDate : throw new FormatException($"DateVoted '{updateVoteDto.DateVoted}' is not in a valid DateTime format.");

        vote.Update(
            voteType: voteType,
            isActive: updateVoteDto.IsActive,
            dateVoted: parsedDate
        );
    }
}
