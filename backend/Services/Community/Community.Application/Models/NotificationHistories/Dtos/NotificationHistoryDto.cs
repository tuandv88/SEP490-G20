namespace Community.Application.Models.NotificationHistories.Dtos;

public record NotificationHistoryDto(
    Guid Id,                      // ID của thông báo
    Guid UserId,                  // ID của người nhận thông báo
    Guid NotificationTypeId,      // ID loại thông báo
    string Message,               // Nội dung thông báo
    DateTime DateSent,            // Thời gian gửi thông báo
    DateTime? DateRead,           // Thời gian người dùng đọc thông báo
    bool IsRead,                  // Đánh dấu đã đọc
    SentVia SentVia,              // Phương thức gửi thông báo
    Status Status,                // Trạng thái của thông báo
    DateTime DateCreated,         // Thời gian tạo thông báo
    string? Subject,              // Tiêu đề của thông báo (nullable)
    Guid? SenderId                // ID người gửi (nullable)
);



