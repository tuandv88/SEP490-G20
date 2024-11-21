namespace Community.Application.Models.NotificationHistories.Dtos;

public record CreateNotificationHistoryDto(
        Guid NotificationTypeId,           // ID loại thông báo
        string Message,                    // Nội dung thông báo
        string SentVia,                   // Phương thức gửi: web, email, cả hai
        string Status                      // Trạng thái gửi: Đã gửi, Thất bại, Chờ, Đã nhận
    );
