
namespace Community.Infrastructure.Data.Configurations
{
    public class NotificationHistoryConfiguration : IEntityTypeConfiguration<NotificationHistory>
    {
        public void Configure(EntityTypeBuilder<NotificationHistory> builder)
        {
            // Định nghĩa khóa chính
            builder.HasKey(nh => nh.Id);
            builder.Property(nh => nh.Id)
                .HasConversion(
                    id => id.Value,                  // Chuyển NotificationHistoryId thành Guid
                    guid => new NotificationHistoryId(guid));

            // Cấu hình các thuộc tính
            builder.Property(nh => nh.UserId)
                .HasConversion(
                    id => id.Value,
                    guid => new UserId(guid))
                .IsRequired();

            builder.Property(nh => nh.NotificationTypeId)
                .HasConversion(
                    id => id.Value,
                    guid => new NotificationTypeId(guid))
                .IsRequired();

            builder.Property(nh => nh.UserNotificationSettingId)
                .HasConversion(
                    id => id.Value,
                    guid => new UserNotificationSettingId(guid))
                .IsRequired();

            builder.Property(nh => nh.Message)
                   .IsRequired();

            builder.Property(nh => nh.DateCreated)
                .IsRequired();  // Cấu hình trường DateCreated

            builder.Property(nh => nh.DateSent)
                .IsRequired();

            builder.Property(nh => nh.DateRead);

            builder.Property(nh => nh.IsRead)
                .HasDefaultValue(false);

            builder.Property(nh => nh.SentVia)
                .IsRequired();

            builder.Property(nh => nh.Status)
                .IsRequired();

            builder.Property(nh => nh.SenderId)
                .IsRequired(false);  // Trường SenderId có thể null, không bắt buộc

            builder.Property(nh => nh.Subject)
                .HasMaxLength(500)  // Nếu có, giới hạn độ dài của Subject (có thể điều chỉnh tùy vào yêu cầu thực tế)
                .IsRequired(false); // Subject là nullable

            // Thiết lập các chỉ mục
            builder.HasIndex(nh => nh.UserId);
            builder.HasIndex(nh => nh.NotificationTypeId);
            builder.HasIndex(nh => nh.DateSent);
            builder.HasIndex(nh => nh.DateCreated);

        }
    }


}
