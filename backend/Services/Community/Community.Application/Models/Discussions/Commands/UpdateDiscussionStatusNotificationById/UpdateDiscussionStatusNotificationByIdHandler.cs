namespace Community.Application.Models.Discussions.Commands.UpdateDiscussionStatusNotification;

public class UpdateDiscussionStatusNotificationByIdHandler : ICommandHandler<UpdateDiscussionStatusNotificationByIdCommand, UpdateDiscussionStatusNotificationByIdResult>
{
    private readonly IDiscussionRepository _repository;

    public UpdateDiscussionStatusNotificationByIdHandler(IDiscussionRepository repository)
    {
        _repository = repository;
    }

    public async Task<UpdateDiscussionStatusNotificationByIdResult> Handle(UpdateDiscussionStatusNotificationByIdCommand request, CancellationToken cancellationToken)
    {
        var discussion = await _repository.GetByIdAsync(request.Id);

        if (discussion == null)
        {
            throw new NotFoundException("Discussion not found.", request.Id);
        }

        // Chuyển đổi trạng thái NotificationsEnabled
        discussion.NotificationsEnabled = !discussion.NotificationsEnabled;
        discussion.DateUpdated = DateTime.Now;

        await _repository.UpdateAsync(discussion);
        await _repository.SaveChangesAsync(cancellationToken);

        return new UpdateDiscussionStatusNotificationByIdResult(true, discussion.NotificationsEnabled);
    }
}
