namespace Community.Application.Models.NotificationTypes.Dtos
{
    public record CreateNotificationTypeDto(
        string Name,             // Tên loại thông báo
        string Description,      // Mô tả loại thông báo
        bool CanSendEmail,       // Có thể gửi email hay không
        bool CanSendWebsite,     // Có thể gửi qua web hay không
        int Priority             // Độ ưu tiên của thông báo (1-5)
    );
}
