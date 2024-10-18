namespace Learning.Infrastructure.Data.Configurations;
public class ChapterConfiguration : IEntityTypeConfiguration<Chapter> {
    public void Configure(EntityTypeBuilder<Chapter> builder) {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Id).HasConversion(
                        chapterId => chapterId.Value,
                        dbId => ChapterId.Of(dbId));
        
        builder.HasMany(c => c.Lectures)
            .WithOne()
            .HasForeignKey(ci => ci.ChapterId);

        builder.Property(c => c.Title).IsRequired().HasMaxLength(150);

        builder.Property(c => c.Description).HasMaxLength(int.MaxValue);
        builder.Property(c => c.TimeEstimation);
        builder.Property(c => c.OrderIndex);

        builder.Property(c => c.IsActive)
            .HasDefaultValue(true);
    }
}

