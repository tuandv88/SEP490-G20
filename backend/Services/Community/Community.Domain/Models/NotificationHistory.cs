namespace Community.Domain.Models
{
    public class NotificationHistory : Aggregate<NotificationHistoryId>
    {
        public UserId UserId { get; set; } = default!;                       // ID của người nhận thông báo
        public NotificationTypeId NotificationTypeId { get; set; } = default!; // ID loại thông báo
        public string Message { get; set; } = default!;                      // Nội dung thông báo
        public DateTime DateSent { get; set; }                               // Thời gian gửi thông báo
        public DateTime? DateRead { get; set; }                              // Thời gian người dùng đọc thông báo (có thể null)
        public bool IsRead { get; set; }                                     // Đánh dấu thông báo đã đọc hay chưa
        public SentVia SentVia { get; set; } = SentVia.Web!;                     // Phương thức gửi: web, email, cả hai
        public Status Status { get; set; } = Status.Sent!;                       // Trạng thái gửi: Đã gửi, Thất bại, Chờ, Đã nhận

        // Phương thức khởi tạo một NotificationHistory
        public static NotificationHistory Create(NotificationHistoryId notificationHistoryId, UserId userId, NotificationTypeId notificationTypeId, string message, SentVia sentVia, Status status)
        {
            return new NotificationHistory
            {
                Id = notificationHistoryId,
                UserId = userId,
                NotificationTypeId = notificationTypeId,
                Message = message,
                DateSent = DateTime.Now,
                IsRead = false,
                SentVia = sentVia,
                Status = status
            };
        }

        // Phương thức đánh dấu thông báo là đã đọc
        public void MarkAsRead()
        {
            IsRead = true;
            DateRead = DateTime.Now;
        }
    }

}
