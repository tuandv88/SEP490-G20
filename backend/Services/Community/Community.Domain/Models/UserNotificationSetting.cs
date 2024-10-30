namespace Community.Domain.Models
{
    public class UserNotificationSetting : Aggregate<UserNotificationSettingId>
    {
        public UserId UserId { get; set; } = default!;                       // ID của người dùng
        public NotificationTypeId NotificationTypeId { get; set; } = default!; // ID loại thông báo áp dụng cài đặt này
        public bool IsNotificationEnabled { get; set; }                      // Kích hoạt thông báo hay không
        public bool IsEmailEnabled { get; set; }                             // Kích hoạt email hay không
        public bool IsWebsiteEnabled { get; set; }                           // Kích hoạt thông báo qua web hay không
        public NotificationFrequency NotificationFrequency { get; set; } = NotificationFrequency.Daily; // Tần suất nhận thông báo

        // Phương thức khởi tạo một UserNotificationSetting
        public static UserNotificationSetting Create(UserId userId, NotificationTypeId notificationTypeId, bool isNotificationEnabled, bool isEmailEnabled, bool isWebsiteEnabled, NotificationFrequency notificationFrequency)
        {
            return new UserNotificationSetting
            {
                UserId = userId,
                NotificationTypeId = notificationTypeId,
                IsNotificationEnabled = isNotificationEnabled,
                IsEmailEnabled = isEmailEnabled,
                IsWebsiteEnabled = isWebsiteEnabled,
                NotificationFrequency = notificationFrequency
            };
        }

        // Phương thức cập nhật cài đặt thông báo
        public void UpdateSettings(bool isNotificationEnabled, bool isEmailEnabled, bool isWebsiteEnabled, NotificationFrequency notificationFrequency)
        {
            IsNotificationEnabled = isNotificationEnabled;
            IsEmailEnabled = isEmailEnabled;
            IsWebsiteEnabled = isWebsiteEnabled;
            NotificationFrequency = notificationFrequency;
        }
    }
}
