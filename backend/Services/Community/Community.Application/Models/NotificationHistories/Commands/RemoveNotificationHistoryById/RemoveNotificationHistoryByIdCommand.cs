namespace Community.Application.Models.NotificationHistories.Commands.RemoveNotificationHistoryById;
public record RemoveNotificationHistoryByIdResult(bool IsSuccess);
[Authorize]
public record RemoveNotificationHistoryByIdCommand(Guid Id) : ICommand<RemoveNotificationHistoryByIdResult>;
