namespace Community.Application.Models.UserDiscussions.Commands.UpdateUserDiscusisonStatusNotification;

public class UpdateUserDiscusisonStatusNotificationHandler : ICommandHandler<UpdateUserDiscusisonStatusNotificationCommand, UpdateUserDiscusisonStatusNotificationResult>
{
    private readonly IUserDiscussionRepository _repository;

    public UpdateUserDiscusisonStatusNotificationHandler(IUserDiscussionRepository repository)
    {
        _repository = repository;
    }

    public async Task<UpdateUserDiscusisonStatusNotificationResult> Handle(UpdateUserDiscusisonStatusNotificationCommand request, CancellationToken cancellationToken)
    {
        var userDiscussion = await _repository.GetByUserIdAnDiscussionId(request.UserId, request.DiscussionId);

        if (userDiscussion == null)
        {
            throw new NotFoundException("User-Discussion not found." + "UserId: " + request.UserId + " DiscussionId: " + request.DiscussionId);
        }

        // Chuyển đổi trạng thái NotificationsEnabled
        userDiscussion.NotificationsEnabled = !userDiscussion.NotificationsEnabled;

        await _repository.UpdateAsync(userDiscussion);
        await _repository.SaveChangesAsync(cancellationToken);

        return new UpdateUserDiscusisonStatusNotificationResult(true, userDiscussion.NotificationsEnabled);
    }
}