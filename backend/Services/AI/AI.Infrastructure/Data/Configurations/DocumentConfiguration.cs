using Newtonsoft.Json;

namespace AI.Infrastructure.Data.Configurations;
public class DocumentConfiguration : IEntityTypeConfiguration<Document> {
    public void Configure(EntityTypeBuilder<Document> builder) {
        builder.HasKey(d => d.Id);

        builder.Property(d => d.Id).HasConversion(
            documentId => documentId.Value,
            dbId => DocumentId.Of(dbId));

        builder.Property(d => d.Tags)
                  .HasConversion(
                       v => JsonConvert.SerializeObject(v),
                       v => JsonConvert.DeserializeObject<Dictionary<string, object>>(v)!
                  );

        builder.Property(d => d.FileName)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(d => d.MimeType)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(d => d.FileSize)
            .IsRequired();

        builder.HasMany(d => d.Messages)
            .WithMany(m => m.References)
            .UsingEntity<Dictionary<string, object>>(
                "MessageDocument",
                j => j
                    .HasOne<Message>()
                    .WithMany()
                    .HasForeignKey("MessageId")
                    .OnDelete(DeleteBehavior.Cascade),
                j => j
                    .HasOne<Document>()
                    .WithMany()
                    .HasForeignKey("DocumentId")
                    .OnDelete(DeleteBehavior.Cascade)
            );
    }
}

