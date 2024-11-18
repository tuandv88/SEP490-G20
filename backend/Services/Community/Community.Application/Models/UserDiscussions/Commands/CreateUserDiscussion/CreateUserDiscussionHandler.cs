using Community.Application.Models.UserDiscussions.Dtos;
using Community.Domain.Models;
using Community.Domain.ValueObjects;

namespace Community.Application.Models.UserDiscussions.Commands.CreateUserDiscussion;

public class CreateUserDiscussionHandler : ICommandHandler<CreateUserDiscussionCommand, CreateUserDiscussionResult>
{
    private readonly IUserDiscussionRepository _userDiscussionRepository;

    public CreateUserDiscussionHandler(IUserDiscussionRepository userDiscussionRepository)
    {
        _userDiscussionRepository = userDiscussionRepository;
    }

    public async Task<CreateUserDiscussionResult> Handle(CreateUserDiscussionCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var userDiscussion = await CreateNewUserDiscussion(request.CreateUserDiscussionDto);

            await _userDiscussionRepository.AddAsync(userDiscussion);
            await _userDiscussionRepository.SaveChangesAsync(cancellationToken);

            return new CreateUserDiscussionResult(userDiscussion.Id.Value, true);
        }
        catch (Exception)
        {
            return new CreateUserDiscussionResult(Guid.Empty, false);
        }
    }

    private async Task<UserDiscussion> CreateNewUserDiscussion(CreateUserDiscussionDto dto)
    {
        var userId = UserId.Of(dto.UserId);
        var discussionId = DiscussionId.Of(dto.DiscussionId);

        return new UserDiscussion
        {
            Id = UserDiscussionId.Of(Guid.NewGuid()),
            UserId = userId,
            DiscussionId = discussionId,
            IsFollowing = dto.IsFollowing,
            DateFollowed = dto.DateFollowed ?? DateTime.UtcNow,
            LastViewed = dto.LastViewed,
            NotificationsEnabled = dto.NotificationsEnabled
        };
    }
}
