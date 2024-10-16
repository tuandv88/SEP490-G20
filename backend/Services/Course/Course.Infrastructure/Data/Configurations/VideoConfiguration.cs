
namespace Course.Infrastructure.Data.Configurations;
public class VideoConfiguration : IEntityTypeConfiguration<Video> {
    public void Configure(EntityTypeBuilder<Video> builder) {
        builder.HasKey(v => v.Id);

        builder.Property(v => v.Id).HasConversion(
                        videoId => videoId.Value,
                        dbId => VideoId.Of(dbId));

        builder.Property(v => v.IsActive).HasDefaultValue(true);
        builder.Property(v => v.FileName).HasMaxLength(100);
        builder.Property(v => v.Url);
        builder.Property(v => v.Format);
        builder.Property(v => v.FileSize);
        builder.Property(v => v.Duration);
    }
}

