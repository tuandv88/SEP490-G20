namespace Community.Application.Models.UserDiscussions.Commands.UpdateUserDiscusisonStatusNotification;

public record UpdateUserDiscusisonStatusNotificationResult(bool IsSuccess, bool NewStatus);
[Authorize]
public record UpdateUserDiscusisonStatusNotificationCommand(Guid UserId, Guid DiscussionId) : ICommand<UpdateUserDiscusisonStatusNotificationResult>;
