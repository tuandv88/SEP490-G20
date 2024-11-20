namespace Community.Application.Models.NotificationTypes.Dtos
{
    public record NotificationTypeDto(
        Guid Id,                    // ID của loại thông báo
        string Name,                // Tên loại thông báo
        string Description,         // Mô tả
        bool CanSendEmail,          // Có thể gửi email hay không
        bool CanSendWebsite,        // Có thể gửi qua web hay không
        int Priority                // Độ ưu tiên
    );
}
