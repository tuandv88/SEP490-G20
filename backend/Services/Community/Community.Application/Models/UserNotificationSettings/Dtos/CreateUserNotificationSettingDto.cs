namespace Community.Application.Models.UserNotificationSettings.Dtos;

public record CreateUserNotificationSettingDto(
    Guid NotificationTypeId,          // ID loại thông báo
    bool IsNotificationEnabled,       // Kích hoạt thông báo hay không
    bool IsEmailEnabled,              // Kích hoạt email hay không
    bool IsWebsiteEnabled,            // Kích hoạt thông báo qua web hay không
    string NotificationFrequency      // Tần suất nhận thông báo
);
