using Community.Application.Models.UserDiscussions.Commands.UpdateUserDiscussion;
using Community.Application.Models.UserDiscussions.Dtos;
using Community.Domain.Models;
using Community.Domain.ValueObjects;

namespace Community.Application.Models.UserDiscussions.Commands.UpdateUserDiscussion;

public class UpdateUserDiscussionHandler : ICommandHandler<UpdateUserDiscussionCommand, UpdateUserDiscussionResult>
{
    private readonly IUserDiscussionRepository _userDiscussionRepository;

    public UpdateUserDiscussionHandler(IUserDiscussionRepository userDiscussionRepository)
    {
        _userDiscussionRepository = userDiscussionRepository;
    }

    public async Task<UpdateUserDiscussionResult> Handle(UpdateUserDiscussionCommand request, CancellationToken cancellationToken)
    {
        var userDiscussion = await _userDiscussionRepository.GetByIdAsync(request.UpdateUserDiscussionDto.Id);

        if (userDiscussion == null)
        {
            throw new NotFoundException("UserDiscussion not found.", request.UpdateUserDiscussionDto.Id);
        }

        UpdateUserDiscussionWithNewValues(userDiscussion, request.UpdateUserDiscussionDto);

        await _userDiscussionRepository.UpdateAsync(userDiscussion);
        await _userDiscussionRepository.SaveChangesAsync(cancellationToken);

        return new UpdateUserDiscussionResult(true);
    }

    private void UpdateUserDiscussionWithNewValues(UserDiscussion userDiscussion, UpdateUserDiscussionDto updateUserDiscussionDto)
    {
        userDiscussion.IsFollowing = updateUserDiscussionDto.IsFollowing;
        userDiscussion.DateFollowed = updateUserDiscussionDto.DateFollowed;
        userDiscussion.LastViewed = updateUserDiscussionDto.LastViewed;
        userDiscussion.NotificationsEnabled = updateUserDiscussionDto.NotificationsEnabled;
    }
}
