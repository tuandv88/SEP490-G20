namespace Community.Application.Models.NotificationTypes.Commands.RemoveNotificationTypeById;

public record RemoveNotificationTypeByIdResult(bool IsSuccess);
[Authorize]
public record RemoveNotificationTypeByIdCommand(Guid Id) : ICommand<RemoveNotificationTypeByIdResult>;