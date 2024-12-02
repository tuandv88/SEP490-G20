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
                    id => id.Value,                             // Chuyển NotificationTypeId thành Guid
                    guid => new NotificationTypeId(guid));

            // Cấu hình thuộc tính
            builder.Property(nt => nt.Name)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(nt => nt.Description)
                .HasMaxLength(500);

            builder.Property(nt => nt.CanSendEmail)
                .IsRequired();

            builder.Property(nt => nt.CanSendWebsite)
                .IsRequired();

            builder.Property(nt => nt.Priority)
                .IsRequired();


            // Thiết lập chỉ mục
            builder.HasIndex(nt => nt.Name);

            // Mối quan hệ với NotificationHistory
            builder.HasMany(uns => uns.NotificationHistorys)
                .WithOne()
                .HasForeignKey(nh => nh.NotificationTypeId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }

}
