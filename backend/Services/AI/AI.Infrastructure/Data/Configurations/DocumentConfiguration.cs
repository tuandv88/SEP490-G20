using Microsoft.EntityFrameworkCore.ChangeTracking;
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
                v => JsonConvert.DeserializeObject<Dictionary<string, object>>(v ?? "{}")!)
            .Metadata.SetValueComparer(new ValueComparer<Dictionary<string, object>>(
                (d1, d2) => d1.Count == d2.Count && !d1.Except(d2).Any(),
                d => d.Aggregate(0, (hash, kvp) => HashCode.Combine(hash, kvp.Key.GetHashCode(), GetSafeHashCode(kvp.Value))),
                d => d.ToDictionary(kvp => kvp.Key, kvp => kvp.Value)
            ));

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
    private static int GetSafeHashCode(object obj) {
        return obj?.GetHashCode() ?? 0;
    }
}

