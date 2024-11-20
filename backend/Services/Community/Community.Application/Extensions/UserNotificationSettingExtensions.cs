using Community.Application.Models.UserNotificationSettings.Dtos;

namespace Community.Application.Extensions;

public static class UserNotificationSettingExtensions
{
    public static UserNotificationSettingDto ToUserNotificationSettingDto(this UserNotificationSetting setting)
    {
        return new UserNotificationSettingDto(
            setting.UserId.Value,
            setting.NotificationTypeId.Value,
            setting.IsNotificationEnabled,
            setting.IsEmailEnabled,
            setting.IsWebsiteEnabled,
            setting.NotificationFrequency
        );
    }
}
