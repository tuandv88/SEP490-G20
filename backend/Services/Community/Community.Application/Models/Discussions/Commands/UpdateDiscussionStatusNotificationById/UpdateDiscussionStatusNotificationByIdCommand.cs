namespace Community.Application.Models.Discussions.Commands.UpdateDiscussionStatusNotification;

public record UpdateDiscussionStatusNotificationByIdResult(bool IsSuccess, bool NewStatus);
[Authorize]
public record UpdateDiscussionStatusNotificationByIdCommand(Guid Id) : ICommand<UpdateDiscussionStatusNotificationByIdResult>;