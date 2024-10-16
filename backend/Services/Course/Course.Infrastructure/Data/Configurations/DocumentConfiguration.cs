using Course.Domain.Model;

namespace Course.Infrastructure.Data.Configurations;
public class DocumentConfiguration : IEntityTypeConfiguration<Document> {
    public void Configure(EntityTypeBuilder<Document> builder) {
        builder.HasKey(d => d.Id);

        builder.Property(d => d.Id).HasConversion(
                        documentId => documentId.Value,
                        dbId => DocumentId.Of(dbId));

        builder.Property(d => d.IsActive).HasDefaultValue(true);
        builder.Property(d => d.FileName).HasMaxLength(100);
        builder.Property(d => d.Url);
        builder.Property(d => d.Format);
        builder.Property(d => d.FileSize);
    }
}

