using User.Domain.ValueObjects;

namespace User.Domain.Models
{
    public class UserNotification : Aggregate<UserNotificationId> 
    {
        // Các thuộc tính của UserNotification
        public Guid UserId { get; private set; }
        public NotificationTypeId NotificationTypeId { get; private set; }
        public bool IsEnabled { get; private set; }
        public virtual NotificationType NotificationType { get; private set; }

        // Phương thức khởi tạo tĩnh (static factory method)
        public static UserNotification Create(UserNotificationId id, Guid userId, NotificationTypeId notificationTypeId, bool isEnabled, NotificationType notificationType)
        {
            return new UserNotification
            {
                Id = id,
                UserId = userId,
                NotificationTypeId = notificationTypeId,
                IsEnabled = isEnabled,
                NotificationType = notificationType
            };
        }

        // Phương thức bật/tắt thông báo
        public void ToggleNotification(bool isEnabled)
        {
            IsEnabled = isEnabled;
        }
    }
}
