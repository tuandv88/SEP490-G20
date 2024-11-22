
namespace Learning.Infrastructure.Data.Configurations;
public class FileConfiguration : IEntityTypeConfiguration<Domain.Models.File> {
    public void Configure(EntityTypeBuilder<Domain.Models.File> builder) {
        builder.HasKey(f => f.Id);

        builder.Property(f => f.Id).HasConversion(
                        fileId => fileId.Value,
                        dbId => FileId.Of(dbId));

        builder.Property(f => f.FileName).IsRequired();
        builder.Property(f => f.Url).HasMaxLength(255).IsRequired();
        builder.Property(f => f.Format).IsRequired();
        builder.Property(f => f.FileSize);
        builder.Property(f => f.IsActive).HasDefaultValue(true);
        builder.Property(f => f.FileType)

            .HasDefaultValue(FileType.DOCUMENT)
            .HasConversion(
                s => s.ToString(), dbStatus => (FileType)Enum.Parse(typeof(FileType), dbStatus));
        builder.Property(f => f.Duration).HasDefaultValue(null);
    }
}

