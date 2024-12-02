namespace Community.Domain.Models
{
    public class NotificationType : Aggregate<NotificationTypeId>
    {
        public List<NotificationHistory> NotificationHistorys = new();
        public string Name { get; set; } = default!;                   // Tên loại thông báo
        public string Description { get; set; } = default!;            // Mô tả loại thông báo
        public bool CanSendEmail { get; set; }                         // Có thể gửi email hay không
        public bool CanSendWebsite { get; set; }                       // Có thể gửi qua web hay không
        public int Priority { get; set; }                              // Độ ưu tiên thông báo (1-5, 5 cao nhất)

        // Phương thức khởi tạo một NotificationType
        public static NotificationType Create(NotificationTypeId id, string name, string description, bool canSendEmail, bool canSendWebsite, int priority)
        {
            return new NotificationType
            {
                Id = id,
                Name = name,
                Description = description,
                CanSendEmail = canSendEmail,
                CanSendWebsite = canSendWebsite,
                Priority = priority
            };
        }

        // Phương thức cập nhật NotificationType
        public void Update(string name, string description, bool canSendEmail, bool canSendWebsite, int priority)
        {
            Name = name;
            Description = description;
            CanSendEmail = canSendEmail;
            CanSendWebsite = canSendWebsite;
            Priority = priority;
        }
    }
}
