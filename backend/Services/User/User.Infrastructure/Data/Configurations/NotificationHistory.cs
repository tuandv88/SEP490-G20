
namespace User.Infrastructure.Data.Configurations
{
    public class NotificationHistoryConfiguration : IEntityTypeConfiguration<NotificationHistory>
    {
        public void Configure(EntityTypeBuilder<NotificationHistory> builder)
        {
            builder.HasKey(nh => nh.Id);

            builder.Property(nh => nh.Id).IsRequired();
            builder.Property(nh => nh.UserId).IsRequired();
            builder.Property(nh => nh.NotificationTypeId).IsRequired();
            builder.Property(nh => nh.Content).IsRequired().HasMaxLength(500);
            builder.Property(nh => nh.DateSent).IsRequired();
            builder.Property(nh => nh.IsRead).IsRequired();
            builder.Property(nh => nh.SentVia).IsRequired();
            builder.Property(nh => nh.Status).IsRequired();
        }
    }
}
