namespace Community.Application.Models.NotificationHistories.Dtos;

public record UpdateNotificationHistoryDto(
    Guid Id,                     // ID của thông báo cần cập nhật
    Guid NotificationTypeId,     // ID loại thông báo
    string Message,              // Nội dung mới
    DateTime? DateRead,          // Thời gian đọc thông báo (có thể null)
    bool IsRead,                 // Trạng thái đã đọc hay chưa
    string SentVia,              // Phương thức gửi: Web, Email, Both
    string Status,               // Trạng thái gửi: Sent, Failed, Pending, Received
    string? Subject             // Tiêu đề mới của thông báo (nullable)
);

