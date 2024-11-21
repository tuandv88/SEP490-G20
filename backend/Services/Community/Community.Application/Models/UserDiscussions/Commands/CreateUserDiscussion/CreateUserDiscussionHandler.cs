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
        // Dữ liệu test UserId
        var userContextTest = "c3d4e5f6-a7b8-9012-3456-789abcdef010";

        if (!Guid.TryParse(userContextTest, out var currentUserIdTest))
        {
            throw new UnauthorizedAccessException("Invalid user ID.");
        }

        var userId = UserId.Of(currentUserIdTest);

        // Lấy UserId từ UserContextService
        //var currentUserId = _userContextService.User.Id;

        //if (currentUserId == null)
        //{
        //    throw new UnauthorizedAccessException("User is not authenticated.");
        //}

        //var userId = UserId.Of(currentUserId.Value);

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
