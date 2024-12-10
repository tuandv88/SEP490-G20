using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community.Application.Models.UserNotificationSettings.Dtos;

public record UpdateUserNotificationSettingDto(
    Guid Id,                          // ID của cài đặt thông báo cần cập nhật
    bool IsNotificationEnabled,       // Kích hoạt thông báo hay không
    bool IsEmailEnabled,              // Kích hoạt email hay không
    bool IsWebsiteEnabled,            // Kích hoạt thông báo qua web hay không
    string NotificationFrequency      // Tần suất nhận thông báo: Daily, Weekly, Monthly
);
