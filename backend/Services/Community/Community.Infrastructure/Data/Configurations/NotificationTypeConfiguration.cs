using Community.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Community.Infrastructure.Data.Configurations
{
    public class NotificationTypeConfiguration : IEntityTypeConfiguration<NotificationType>
    {
        public void Configure(EntityTypeBuilder<NotificationType> builder)
        {
            // Định nghĩa khóa chính
            builder.HasKey(nt => nt.Id);
            builder.Property(nt => nt.Id)
                .HasConversion(
                    notificationTypeId => notificationTypeId.Value,      // Chuyển NotificationTypeId thành Guid
                    dbId => NotificationTypeId.Of(dbId));                // Chuyển Guid thành NotificationTypeId

            // Cấu hình các thuộc tính của NotificationType
            builder.Property(nt => nt.Name)
                .IsRequired()
                .HasMaxLength(100);                                      // Tên loại thông báo, giới hạn 100 ký tự

            builder.Property(nt => nt.Description)
                .IsRequired(false)
                .HasMaxLength(500);                                      // Mô tả, có thể null, giới hạn 500 ký tự

            builder.Property(nt => nt.CanSendEmail)
                .IsRequired();                                           // Bắt buộc có, đánh dấu có thể gửi email

            builder.Property(nt => nt.CanSendWebsite)
                .IsRequired();                                           // Bắt buộc có, đánh dấu có thể gửi qua website

            builder.Property(nt => nt.Priority)
                .IsRequired()
                .HasDefaultValue(3);                                     // Độ ưu tiên mặc định là 3 (trung bình)

            // Thiết lập chỉ mục cho các trường cần tìm kiếm nhanh
            builder.HasIndex(nt => nt.Name).IsUnique();                  // Đảm bảo tên là duy nhất
            builder.HasIndex(nt => nt.Priority);                         // Chỉ mục cho Priority để tìm kiếm theo độ ưu tiên
        }
    }
}
