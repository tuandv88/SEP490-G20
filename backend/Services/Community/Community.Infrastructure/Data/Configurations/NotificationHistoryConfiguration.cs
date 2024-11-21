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
            builder.HasKey(nh => nh.Id);
            builder.Property(nh => nh.Id)
                .HasConversion(
                    id => id.Value,                  // Chuyển NotificationHistoryId thành Guid
                    guid => new NotificationHistoryId(guid));

            // Cấu hình thuộc tính
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

            builder.Property(nh => nh.Message)
                .IsRequired()
                .HasMaxLength(1000);

            builder.Property(nh => nh.DateSent)
                .IsRequired();

            builder.Property(nh => nh.IsRead)
                .HasDefaultValue(false);

            builder.Property(nh => nh.DateRead);

            builder.Property(nh => nh.SentVia)
                .IsRequired();

            builder.Property(nh => nh.Status)
                .IsRequired();

            // Thiết lập chỉ mục
            builder.HasIndex(nh => nh.UserId);
            builder.HasIndex(nh => nh.NotificationTypeId);
            builder.HasIndex(nh => nh.DateSent);
        }
    }
}
