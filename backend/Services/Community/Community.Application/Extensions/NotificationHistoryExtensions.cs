using Community.Application.Models.NotificationHistories.Dtos;
using Community.Domain.Models;

namespace Community.Application.Extensions;

public static class NotificationHistoryExtensions
{
    public static NotificationHistoryDto ToNotificationHistoryDto(this NotificationHistory notificationHistory)
    {
        return new NotificationHistoryDto(
        Id: notificationHistory.Id.Value,
        UserId: notificationHistory.UserId.Value,
        NotificationTypeId: notificationHistory.NotificationTypeId.Value,
        Message: notificationHistory.Message,
        DateSent: notificationHistory.DateSent,
        DateRead: notificationHistory.DateRead,
        IsRead: notificationHistory.IsRead,
        SentVia: notificationHistory.SentVia,
        Status: notificationHistory.Status,
        DateCreated: notificationHistory.DateCreated,  // Cung cấp DateCreated
        Subject: notificationHistory.Subject,         // Cung cấp Subject
        SenderId: notificationHistory.SenderId // Cung cấp SenderId, có thể null
    );
    }


    // Phương thức mở rộng chuyển đổi từ NotificationHistoryDetail sang NotificationHistoryDetailDto
    public static NotificationHistoryDetailDto ToNotificationHistoryDetailDto(this NotificationHistory notificationHistory, NotificationType notificationType)
    {
        return new NotificationHistoryDetailDto(
            Id: notificationHistory.Id.Value,
            UserId: notificationHistory.UserId.Value,
            NotificationTypeId: notificationHistory.NotificationTypeId.Value,
            Message: notificationHistory.Message,
            DateSent: notificationHistory.DateSent,
            DateRead: notificationHistory.DateRead,
            IsRead: notificationHistory.IsRead,
            SentVia: notificationHistory.SentVia,
            Status: notificationHistory.Status,
            NotificationTypeDto: notificationType.ToNotificationTypeDto(), // Chuyển từ NotificationType sang NotificationTypeDto
            Subject: notificationHistory.Subject, // Thêm Subject
            SenderId: notificationHistory.SenderId, // Thêm SenderId nếu có
            DateCreated: notificationHistory.DateCreated // Thêm DateCreated nếu có
        );
    }
}
