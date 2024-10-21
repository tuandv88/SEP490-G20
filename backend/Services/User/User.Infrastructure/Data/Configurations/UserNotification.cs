
namespace User.Infrastructure.Data.Configurations
{
    public class UserNotificationConfiguration : IEntityTypeConfiguration<UserNotification>
    {
        public void Configure(EntityTypeBuilder<UserNotification> builder)
        {
            builder.HasKey(un => un.Id);

            builder.Property(un => un.Id).IsRequired();
            builder.Property(un => un.UserId).IsRequired();
            builder.Property(un => un.NotificationTypeId).IsRequired();
            builder.Property(un => un.IsEnabled).IsRequired();
        }
    }
}
