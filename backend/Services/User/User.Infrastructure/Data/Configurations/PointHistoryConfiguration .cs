using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using User.Domain.Models;
using User.Domain.ValueObjects;

namespace User.Infrastructure.Data.Configurations
{
    public class PointHistoryConfiguration : IEntityTypeConfiguration<PointHistory>
    {
        public void Configure(EntityTypeBuilder<PointHistory> builder)
        {
            builder.HasKey(ph => ph.Id);

            builder.Property(ph => ph.Id)
                .HasConversion(
                    pointHistoryId => pointHistoryId.Value,
                    dbId => PointHistoryId.Of(dbId));

            builder.Property(lp => lp.UserId)
               .HasConversion(
                   userId => userId.Value,
                   dbId => UserId.Of(dbId));

            builder.Property(ph => ph.Point).IsRequired();
            builder.Property(ph => ph.ChangeType).IsRequired();
            builder.Property(ph => ph.Source).HasMaxLength(500);
            builder.Property(ph => ph.DateReceived).IsRequired();
            builder.Property(ph => ph.LastUpdated).IsRequired();
        }
    }
}
