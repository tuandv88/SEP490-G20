
namespace Course.Infrastructure.Data.Configurations;
public class DiscountCodeConfiguration : IEntityTypeConfiguration<DiscountCode> {
    public void Configure(EntityTypeBuilder<DiscountCode> builder) {
        builder.HasKey(dc => dc.Id);
        builder.Property(dc => dc.Id).HasConversion(
                        discountCoudeId => discountCoudeId.Value,
                        dbId => DiscountCodeId.Of(dbId));

        builder.Property(dc => dc.Code).HasMaxLength(100);
        builder.Property(dc => dc.Percentage);
        builder.Property(dc => dc.ExpirationDate);
        builder.Property(dc => dc.IsActive).HasDefaultValue(true);
        builder.Property(dc => dc.MaxQuantity);
        builder.Property(dc => dc.UsedQuantity);
    }
}

