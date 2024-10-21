
namespace User.Infrastructure.Data.Configurations
{
    public class NotificationTypeConfiguration : IEntityTypeConfiguration<NotificationType>
    {
        public void Configure(EntityTypeBuilder<NotificationType> builder)
        {
            builder.HasKey(nt => nt.Id);

            builder.Property(nt => nt.Id).IsRequired();
            builder.Property(nt => nt.TypeName).IsRequired().HasMaxLength(150);
            builder.Property(nt => nt.Description).HasMaxLength(500);
            builder.Property(nt => nt.RequiresEmail).IsRequired();
            builder.Property(nt => nt.RequiresWebsite).IsRequired();
        }
    }
}
