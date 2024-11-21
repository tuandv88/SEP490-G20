using Community.Application.Models.NotificationTypes.Dtos;

namespace Community.Application.Extensions;

public static class NotificationTypeExtensions
{
    public static NotificationTypeDto ToNotificationTypeDto(this NotificationType notificationType)
    {
        return new NotificationTypeDto(
            Id: notificationType.Id.Value,
            Name: notificationType.Name,
            Description: notificationType.Description,
            CanSendEmail: notificationType.CanSendEmail,
            CanSendWebsite: notificationType.CanSendWebsite,
            Priority: notificationType.Priority
        );
    }
}
