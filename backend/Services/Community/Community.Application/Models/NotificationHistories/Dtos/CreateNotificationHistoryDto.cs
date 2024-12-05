namespace Community.Application.Models.NotificationHistories.Dtos;

public record CreateNotificationHistoryDto(
    Guid UserId,         
    Guid NotificationTypeId,           // ID loại thông báo
    Guid UserNotificationSettingId,           // ID loại thông báo
    string Message,                    // Nội dung thông báo
    string SentVia,                    // Phương thức gửi: web, email, cả hai
    string Status,                     // Trạng thái gửi: Đã gửi, Thất bại, Chờ, Đã nhận
    string? Subject = null            // Tiêu đề của thông báo (nullable)
);

