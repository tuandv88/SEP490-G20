namespace User.Domain.Models
{
    public class NotificationType : Aggregate<NotificationTypeId> 
    {
        // Thuộc tính
        public string TypeName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool RequiresEmail { get; set; }
        public bool RequiresWebsite { get; set; }

        // Quan hệ với các bảng khác
        public virtual ICollection<NotificationHistory> NotificationHistories { get; set; } = new List<NotificationHistory>();
        public virtual ICollection<UserNotification> UserNotifications { get; set; } = new List<UserNotification>();

        // Static factory method (Phương thức khởi tạo tĩnh)
        public static NotificationType Create(Guid id, string typeName, string description, bool requiresEmail, bool requiresWebsite)
        {
            return new NotificationType
            {
                Id = NotificationTypeId.Of(id), // Sử dụng ValueObject cho Id
                TypeName = typeName,
                Description = description,
                RequiresEmail = requiresEmail,
                RequiresWebsite = requiresWebsite
            };
        }

        // Các phương thức có thể thêm:
        // Kiểm tra nếu yêu cầu gửi qua Email hoặc Website
        public bool IsRequiredForEmail() => RequiresEmail;
        public bool IsRequiredForWebsite() => RequiresWebsite;

        // Cập nhật thông tin mô tả (nếu có thay đổi)
        public void UpdateDescription(string newDescription)
        {
            Description = newDescription;
        }

        // Thêm các logic liên quan khác nếu cần
    }
}
