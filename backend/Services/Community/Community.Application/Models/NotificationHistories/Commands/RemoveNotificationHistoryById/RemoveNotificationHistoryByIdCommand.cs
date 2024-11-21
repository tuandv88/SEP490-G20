﻿namespace Community.Application.Models.NotificationHistories.Commands.RemoveNotificationHistoryById;
public record RemoveNotificationHistoryByIdResult(bool IsSuccess);
public record RemoveNotificationHistoryByIdCommand(Guid Id) : ICommand<RemoveNotificationHistoryByIdResult>;
