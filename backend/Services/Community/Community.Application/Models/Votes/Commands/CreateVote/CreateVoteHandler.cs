using Community.Application.Models.Votes.Dtos;
using Community.Domain.Models;
using Community.Domain.ValueObjects;
using Community.Domain.Enums;

namespace Community.Application.Models.Votes.Commands.CreateVote;

public class CreateVoteHandler : ICommandHandler<CreateVoteCommand, CreateVoteResult>
{
    private readonly IVoteRepository _voteRepository;

    public CreateVoteHandler(IVoteRepository voteRepository)
    {
        _voteRepository = voteRepository;
    }

    public async Task<CreateVoteResult> Handle(CreateVoteCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var vote = await CreateNewVote(request.CreateVoteDto);

            await _voteRepository.AddAsync(vote);
            await _voteRepository.SaveChangesAsync(cancellationToken);

            return new CreateVoteResult(vote.Id.Value, true);
        }
        catch (Exception ex)
        {
            return new CreateVoteResult(null, false);
        }
    }

    private async Task<Vote> CreateNewVote(CreateVoteDto createVoteDto)
    {
        var voteType = Enum.TryParse<VoteType>(createVoteDto.VoteType, out var type)
            ? type
            : throw new ArgumentOutOfRangeException(nameof(createVoteDto.VoteType), $"Value '{createVoteDto.VoteType}' is not valid for VoteType.");

        var dateVoted = DateTime.TryParse(createVoteDto.DateVoted, out var parsedDate)
            ? parsedDate
            : throw new FormatException($"DateVoted '{createVoteDto.DateVoted}' is not in a valid DateTime format.");

        // Convert `Guid` to `UserId`, `DiscussionId?`, and `CommentId?`
        var userId = UserId.Of(createVoteDto.UserId);
        var discussionId = createVoteDto.DiscussionId.HasValue ? DiscussionId.Of(createVoteDto.DiscussionId.Value) : null;
        var commentId = createVoteDto.CommentId.HasValue ? CommentId.Of(createVoteDto.CommentId.Value) : null;

        return Vote.Create(
            voteId: VoteId.Of(Guid.NewGuid()),
            userId: userId,                       // Using converted `UserId`
            discussionId: discussionId,           // Using converted `DiscussionId?`
            commentId: commentId,                 // Using converted `CommentId?`
            voteType: voteType,
            dateVoted: parsedDate,
            isActive: createVoteDto.IsActive
        );
    }
}
