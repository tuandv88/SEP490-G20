using Community.Domain.Enums;
using Community.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Community.Infrastructure.Data.Configurations
{
    public class UserNotificationSettingConfiguration : IEntityTypeConfiguration<UserNotificationSetting>
    {
        public void Configure(EntityTypeBuilder<UserNotificationSetting> builder)
        {
            // Định nghĩa khóa chính
            builder.HasKey(uns => uns.Id);
            builder.Property(uns => uns.Id)
                .HasConversion(
                    userNotificationSettingId => userNotificationSettingId.Value, // Chuyển UserNotificationSettingId thành Guid
                    dbId => UserNotificationSettingId.Of(dbId));                  // Chuyển Guid thành UserNotificationSettingId

            // Ánh xạ UserId với Value Converter
            builder.Property(uns => uns.UserId)
                .HasConversion(
                    userId => userId.Value,                                      // Chuyển UserId thành Guid
                    dbUserId => new UserId(dbUserId))                            // Chuyển Guid thành UserId
                .IsRequired();

            // Ánh xạ NotificationTypeId với Value Converter
            builder.Property(uns => uns.NotificationTypeId)
                .HasConversion(
                    notificationTypeId => notificationTypeId.Value,              // Chuyển NotificationTypeId thành Guid
                    dbNotificationTypeId => new NotificationTypeId(dbNotificationTypeId)) // Chuyển Guid thành NotificationTypeId
                .IsRequired();

            // Cấu hình các thuộc tính còn lại
            builder.Property(uns => uns.IsNotificationEnabled)
                .IsRequired();                                                   // Bắt buộc có, cho biết có kích hoạt thông báo hay không

            builder.Property(uns => uns.IsEmailEnabled)
                .IsRequired();                                                   // Bắt buộc có, cho biết có kích hoạt email hay không

            builder.Property(uns => uns.IsWebsiteEnabled)
                .IsRequired();                                                   // Bắt buộc có, cho biết có kích hoạt thông báo qua web hay không

            // Chuyển đổi NotificationFrequency (enum) thành chuỗi
            builder.Property(uns => uns.NotificationFrequency)
                .IsRequired()
                .HasConversion(
                    nf => nf.ToString(),                                         // Chuyển NotificationFrequency thành chuỗi
                    nf => (NotificationFrequency)Enum.Parse(typeof(NotificationFrequency), nf)) // Chuyển chuỗi thành NotificationFrequency

                .HasDefaultValue(NotificationFrequency.Daily);                   // Tần suất mặc định là Daily

            // Thiết lập các chỉ mục để tối ưu hóa hiệu năng tìm kiếm
            builder.HasIndex(uns => uns.UserId);
            builder.HasIndex(uns => uns.NotificationTypeId);
            builder.HasIndex(uns => uns.IsNotificationEnabled);
            builder.HasIndex(uns => uns.NotificationFrequency);
        }
    }
}
