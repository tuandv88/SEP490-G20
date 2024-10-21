using User.Domain.Enums;
using User.Domain.ValueObjects;

namespace User.Domain.Models
{
    public class NotificationHistory : Aggregate<NotificationHistoryId> 
    {
        public Guid UserId { get; set; }
        public NotificationTypeId NotificationTypeId { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime DateSent { get; set; }
        public bool IsRead { get; set; }
        public SentVia SentVia { get; set; } // Enum từ User.Domain.Enums
        public NotificationStatus Status { get; set; } // Enum từ User.Domain.Enums

        // Liên kết với NotificationType (Quan hệ giữa các bảng)
        public virtual NotificationType NotificationType { get; set; } = default!;

        // Static factory method (Phương thức khởi tạo tĩnh)
        public static NotificationHistory Create(Guid userId, NotificationTypeId notificationTypeId, string content, DateTime dateSent, SentVia sentVia, NotificationStatus status)
        {
            return new NotificationHistory
            {
                Id = NotificationHistoryId.Of(Guid.NewGuid()), // Sử dụng ValueObject cho Id
                UserId = userId,
                NotificationTypeId = notificationTypeId,
                Content = content,
                DateSent = dateSent,
                IsRead = false, // Mặc định chưa đọc
                SentVia = sentVia,
                Status = status
            };
        }

        // Phương thức để đánh dấu thông báo đã đọc
        public void MarkAsRead()
        {
            IsRead = true;
        }

        // Phương thức để thay đổi trạng thái
        public void ChangeStatus(NotificationStatus newStatus)
        {
            Status = newStatus;
        }
    }
}
