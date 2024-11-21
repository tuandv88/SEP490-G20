namespace Community.Application.Models.UserNotificationSettings.Dtos
{
    public record UserNotificationSettingDto(
        Guid Id,
        Guid UserId,                             // ID người dùng
        Guid NotificationTypeId,                 // ID loại thông báo
        bool IsNotificationEnabled,              // Kích hoạt thông báo hay không
        bool IsEmailEnabled,                     // Kích hoạt email hay không
        bool IsWebsiteEnabled,                   // Kích hoạt thông báo qua web hay không
        NotificationFrequency NotificationFrequency // Tần suất nhận thông báo
    );
}
