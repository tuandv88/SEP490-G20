namespace Community.Domain.Models
{
    public class NotificationHistory : Aggregate<NotificationHistoryId>
    {
        public UserId UserId { get; set; } = default!;                       // ID của người nhận thông báo
        public NotificationTypeId NotificationTypeId { get; set; } = default!; // ID loại thông báo
        public UserNotificationSettingId UserNotificationSettingId { get; set; } = default!; // Liên kết tới cài đặt của người dùng cho loại thông báo
        public string? Subject { get; set; }                                 // Tiêu đề của thông báo nếu có.
        public string Message { get; set; } = default!;                      // Nội dung thông báo
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;        // Thời gian tạo thông báo trong hệ thống
        public DateTime DateSent { get; set; }                               // Thời gian gửi thông báo
        public DateTime? DateRead { get; set; }                              // Thời gian người dùng đọc thông báo (có thể null)
        public bool IsRead { get; set; }                                     // Đánh dấu thông báo đã đọc hay chưa
        public SentVia SentVia { get; set; } = SentVia.Web!;                // Phương thức gửi: web, email, cả hai
        public Status Status { get; set; } = Status.Sent!;                   // Trạng thái gửi: Đã gửi, Thất bại, Chờ, Đã nhận
        public Guid? SenderId { get; set; } = null;                          // ID của người gửi (có thể null)

        // Phương thức khởi tạo một NotificationHistory
        public static NotificationHistory Create(
            NotificationHistoryId notificationHistoryId,
            UserId userId,
            NotificationTypeId notificationTypeId,
            UserNotificationSettingId userNotificationSettingId,
            string message,
            SentVia sentVia,
            Status status,
            string? subject = null, Guid? senderId = null) // Thêm subject là tham số tùy chọn
        {
            return new NotificationHistory
            {
                Id = notificationHistoryId,
                UserId = userId,
                NotificationTypeId = notificationTypeId,
                UserNotificationSettingId = userNotificationSettingId,
                Message = message,
                DateCreated = DateTime.UtcNow,  // Thêm DateCreated khi tạo mới
                DateSent = DateTime.UtcNow,
                IsRead = false,
                SentVia = sentVia,
                Status = status,
                Subject = subject,
                SenderId = senderId
            };
        }

        // Cập nhật thông báo với dữ liệu mới
        public void Update(
            NotificationTypeId notificationTypeId,
            string message,
            DateTime? dateRead,
            bool isRead,
            SentVia sentVia,
            Status status,
            string? subject = null) // Thêm subject là tham số tùy chọn
        {
            NotificationTypeId = notificationTypeId;
            Message = message;
            DateRead = dateRead;
            IsRead = isRead;
            SentVia = sentVia;
            Status = status;
            Subject = subject; // Cập nhật Subject nếu có
        }

        // Phương thức đánh dấu thông báo là đã đọc
        public void MarkAsRead()
        {
            IsRead = true;
            DateRead = DateTime.UtcNow;
        }
    }
}
