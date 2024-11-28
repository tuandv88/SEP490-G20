using Community.Domain.ValueObjects;
using Community.Application.Interfaces;

namespace Community.Application.Models.Votes.Commands.CreateVote;

public class CreateVoteHandler : ICommandHandler<CreateVoteCommand, CreateVoteResult>
{
    private readonly IVoteRepository _voteRepository;
    private readonly IDiscussionRepository _discussionRepository;
    private readonly ICommentRepository _commentReponsitory;
    private readonly IUserContextService _userContextService;

    public CreateVoteHandler(IVoteRepository voteRepository, IUserContextService userContextService, IDiscussionRepository discussionRepository, ICommentRepository commentReponsitory)
    {
        _voteRepository = voteRepository;
        _userContextService = userContextService;
        _discussionRepository = discussionRepository;
        _commentReponsitory = commentReponsitory;
    }

    public async Task<CreateVoteResult> Handle(CreateVoteCommand request, CancellationToken cancellationToken)
    {
        var currentUserId = _userContextService.User.Id;

        if (currentUserId == null)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        var userId = UserId.Of(currentUserId);

        var createVoteDto = request.CreateVoteDto;

        if (!createVoteDto.DiscussionId.HasValue && !createVoteDto.CommentId.HasValue)
        {
            throw new NotFoundException($"Discussions Id: {createVoteDto.DiscussionId} || CommentId: {createVoteDto.CommentId} InValid.");
        }

        if (createVoteDto.DiscussionId.HasValue)
        {
            var discussion = await _discussionRepository.GetByIdAsync(createVoteDto.DiscussionId.Value);

            if (discussion != null)
            {
                // Kiểm tra nếu người dùng đã bỏ phiếu cho thảo luận này chưa
                var existingVote = discussion.Votes.FirstOrDefault(v => v.UserId == userId);

                VoteType voteTypeTmp = createVoteDto.VoteType == "Like" ? VoteType.Like : VoteType.Dislike;

                if (createVoteDto.VoteType == "Like")
                {
                    voteTypeTmp = VoteType.Like;
                }
                else if (createVoteDto.VoteType == "Dislike")
                {
                    voteTypeTmp = VoteType.Dislike;
                }
                else
                {
                    throw new NotFoundException("Type Vote: Like / Dislike.");
                }

                if (existingVote == null)
                {
                    var newVote = Vote.Create(
                         voteId: VoteId.Of(Guid.NewGuid()),
                         userId: userId,
                         discussionId: DiscussionId.Of(createVoteDto.DiscussionId.Value),
                         commentId: null,
                         voteType: voteTypeTmp,
                         dateVoted: DateTime.UtcNow,
                         isActive: true
                        );

                    await _voteRepository.AddAsync(newVote);
                    await _voteRepository.SaveChangesAsync(cancellationToken);

                    return new CreateVoteResult(newVote.Id.Value, true, "Add New Vote for Discussion Successfully!");
                }
                else
                {
                    if (existingVote.VoteType == voteTypeTmp)
                    {
                        return new CreateVoteResult(null, false, "Add New Vote for Discussion Failed: Type Existed!");
                    }
                    else
                    {
                        existingVote.VoteType = voteTypeTmp;
                        existingVote.DateVoted = DateTime.UtcNow;
                    }
                    await _voteRepository.UpdateAsync(existingVote);
                    await _voteRepository.SaveChangesAsync(cancellationToken);

                    return new CreateVoteResult(existingVote.Id.Value, true, $"Update VoteType for Discussion change {existingVote.VoteType}.");
                }
            }
        }

        if (createVoteDto.CommentId.HasValue)
        {
            var comment = await _commentReponsitory.GetByIdAsync(createVoteDto.CommentId.Value);

            if (comment != null)
            {
                // Kiểm tra nếu người dùng đã bỏ phiếu cho bình luận này chưa
                var existingVote = comment.Votes.FirstOrDefault(v => v.UserId == userId);

                VoteType voteTypeTmp = createVoteDto.VoteType == "Like" ? VoteType.Like : VoteType.Dislike;

                if (createVoteDto.VoteType == "Like")
                {
                    voteTypeTmp = VoteType.Like;
                }
                else if (createVoteDto.VoteType == "Dislike")
                {
                    voteTypeTmp = VoteType.Dislike;
                }
                else
                {
                    throw new NotFoundException("Type Vote: Like / Dislike.");
                }

                if (existingVote == null)
                {
                    var newVote = Vote.Create(
                         voteId: VoteId.Of(Guid.NewGuid()),
                         userId: userId,
                         discussionId: null,
                         commentId: CommentId.Of(createVoteDto.CommentId.Value),
                         voteType: voteTypeTmp,
                         dateVoted: DateTime.UtcNow,
                         isActive: true
                        );

                    await _voteRepository.AddAsync(newVote);
                    await _voteRepository.SaveChangesAsync(cancellationToken);

                    return new CreateVoteResult(newVote.Id.Value, true, "Add New Vote for Comment Successfully!");
                }
                else
                {
                    if (existingVote.VoteType == voteTypeTmp)
                    {
                        return new CreateVoteResult(null, false, "Add New Vote for Comment  Failed: Type Existed!");
                    }
                    else
                    {
                        existingVote.VoteType = voteTypeTmp;
                        existingVote.DateVoted = DateTime.UtcNow;
                    }

                    await _voteRepository.UpdateAsync(existingVote);
                    await _voteRepository.SaveChangesAsync(cancellationToken);

                    return new CreateVoteResult(existingVote.Id.Value, true, $"Update VoteType for Comment change {existingVote.VoteType}.");
                }
            }
        }

        return new CreateVoteResult(null, false, "Create Failed!");
    }
}


