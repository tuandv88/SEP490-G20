namespace Community.Application.Models.NotificationTypes.Commands.RemoveNotificationTypeById;

public record RemoveNotificationTypeByIdResult(bool IsSuccess);
public record RemoveNotificationTypeByIdCommand(Guid Id) : ICommand<RemoveNotificationTypeByIdResult>;