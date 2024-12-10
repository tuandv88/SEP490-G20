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
                    id => id.Value,                  // Chuyển UserNotificationSettingId thành Guid
                    guid => new UserNotificationSettingId(guid));

            // Cấu hình thuộc tính
            builder.Property(uns => uns.UserId)
                .HasConversion(
                    id => id.Value,
                    guid => new UserId(guid))
                .IsRequired();

            builder.Property(uns => uns.IsNotificationEnabled)
                .IsRequired();

            builder.Property(uns => uns.IsEmailEnabled)
                .IsRequired();

            builder.Property(uns => uns.IsWebsiteEnabled)
                .IsRequired();

            builder.Property(uns => uns.NotificationFrequency)
                .IsRequired();

            // Mối quan hệ với NotificationHistory
            builder.HasMany(uns => uns.NotificationHistorys)
                .WithOne()
                .HasForeignKey(nh => nh.UserNotificationSettingId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }

}
