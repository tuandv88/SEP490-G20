using Community.Application.Models.NotificationHistories.Dtos;
using Community.Domain.Models;

namespace Community.Application.Extensions
{
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
                Status: notificationHistory.Status
            );
        }
    }
}
