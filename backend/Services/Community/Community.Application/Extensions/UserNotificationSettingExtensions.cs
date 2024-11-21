using Community.Application.Models.UserNotificationSettings.Dtos;
using Community.Domain.ValueObjects;

namespace Community.Application.Extensions;

public static class UserNotificationSettingExtensions
{
    public static UserNotificationSettingDto ToUserNotificationSettingDto(this UserNotificationSetting setting)
    {
        return new UserNotificationSettingDto(
            setting.Id.Value,
            setting.UserId.Value,
            setting.NotificationTypeId.Value,
            setting.IsNotificationEnabled,
            setting.IsEmailEnabled,
            setting.IsWebsiteEnabled,
            setting.NotificationFrequency
        );
    }
}
