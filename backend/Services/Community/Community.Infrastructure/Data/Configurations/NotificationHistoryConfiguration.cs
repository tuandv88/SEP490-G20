using Community.Domain.Enums;
using Community.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Community.Infrastructure.Data.Configurations
{
    public class NotificationHistoryConfiguration : IEntityTypeConfiguration<NotificationHistory>
    {
        public void Configure(EntityTypeBuilder<NotificationHistory> builder)
        {
            // Định nghĩa khóa chính
            builder.HasKey(n => n.Id);
            builder.Property(n => n.Id)
                .HasConversion(
                    notificationHistoryId => notificationHistoryId.Value,  // Chuyển NotificationHistoryId thành Guid
                    dbId => NotificationHistoryId.Of(dbId));              // Chuyển Guid thành NotificationHistoryId

            // Ánh xạ UserId với Value Converter
            builder.Property(n => n.UserId)
                .HasConversion(
                    userId => userId.Value,                              // Chuyển UserId thành Guid
                    dbUserId => new UserId(dbUserId))                    // Chuyển Guid thành UserId
                .IsRequired();

            // Ánh xạ NotificationTypeId với Value Converter
            builder.Property(n => n.NotificationTypeId)
                .HasConversion(
                    notificationTypeId => notificationTypeId.Value,      // Chuyển NotificationTypeId thành Guid
                    dbNotificationTypeId => new NotificationTypeId(dbNotificationTypeId)) // Chuyển Guid thành NotificationTypeId
                .IsRequired();

            // Cấu hình các thuộc tính còn lại
            builder.Property(n => n.Message)
                .IsRequired()
                .HasMaxLength(500);                                      // Giới hạn độ dài nội dung thông báo

            builder.Property(n => n.DateSent)
                .IsRequired();

            builder.Property(n => n.DateRead)
                .IsRequired(false);                                      // Có thể null nếu người dùng chưa đọc

            builder.Property(n => n.IsRead)
                .HasDefaultValue(false);                                 // Mặc định thông báo chưa đọc

            // Chuyển đổi kiểu SentVia (enum) thành chuỗi
            builder.Property(n => n.SentVia)
                .IsRequired()
                .HasConversion(
                    v => v.ToString(),                                   // Chuyển SentVia thành chuỗi
                    v => (SentVia)Enum.Parse(typeof(SentVia), v));       // Chuyển chuỗi thành SentVia

            // Chuyển đổi kiểu Status (enum) thành chuỗi
            builder.Property(n => n.Status)
                .IsRequired()
                .HasConversion(
                    v => v.ToString(),                                   // Chuyển Status thành chuỗi
                    v => (Status)Enum.Parse(typeof(Status), v));         // Chuyển chuỗi thành Status

            // Thiết lập các chỉ mục để tối ưu hóa hiệu năng truy vấn
            builder.HasIndex(n => n.UserId);
            builder.HasIndex(n => n.NotificationTypeId);
        }
    }
}