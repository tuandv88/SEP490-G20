using Microsoft.EntityFrameworkCore.ChangeTracking;
using Newtonsoft.Json;

namespace AI.Infrastructure.Data.Configurations;
public class MessageConfiguration : IEntityTypeConfiguration<Message> {
    public void Configure(EntityTypeBuilder<Message> builder) {
        builder.HasKey(m => m.Id);

        builder.Property(m => m.Id).HasConversion(
                        messageId => messageId.Value,
                        dbId => MessageId.Of(dbId));

        builder.Property(m => m.SenderType)
            .HasDefaultValue(SenderType.User)
            .HasConversion(
                s => s.ToString(), dbStatus => (SenderType)Enum.Parse(typeof(SenderType), dbStatus));

        builder.Property(m => m.Content).HasMaxLength(int.MaxValue);

        builder.Property(m => m.PromptType)
            .HasDefaultValue(PromptType.AnswerWithFacts)
            .HasConversion(
                s => s.ToString(), dbStatus => (PromptType)Enum.Parse(typeof(PromptType), dbStatus));

        builder.HasMany(m => m.References)
            .WithMany(d => d.Messages)
            .UsingEntity<Dictionary<string, object>>(
                "MessageDocument",
                j => j
                    .HasOne<Document>()
                    .WithMany()
                    .HasForeignKey("DocumentId")
                    .OnDelete(DeleteBehavior.Cascade),
                j => j
                    .HasOne<Message>()
                    .WithMany()
                    .HasForeignKey("MessageId")
                    .OnDelete(DeleteBehavior.Cascade)
            );

        builder.Property(m => m.NonIndexedExternalReferences)
            .HasConversion(
                v => JsonConvert.SerializeObject(v),
                v => JsonConvert.DeserializeObject<List<string>>(v ?? "[]")!)
            .Metadata.SetValueComparer(new ValueComparer<List<string>>(
                (c1, c2) => c1.SequenceEqual(c2),
                c => c.Aggregate(0, (hash, item) => HashCode.Combine(hash, item.GetHashCode())),
                c => c.ToList()
            ));

        builder.Property(m => m.Context)
            .HasConversion(
                v => JsonConvert.SerializeObject(v),
                v => JsonConvert.DeserializeObject<Dictionary<string, object>>(v ?? "{}")!)
            .Metadata.SetValueComparer(new ValueComparer<Dictionary<string, object>>(
                (d1, d2) => d1.Count == d2.Count && !d1.Except(d2).Any(),
                d => d.Aggregate(0, (hash, kvp) => HashCode.Combine(hash, kvp.Key.GetHashCode(), GetSafeHashCode(kvp.Value))),
                d => d.ToDictionary(kvp => kvp.Key, kvp => kvp.Value)
            ));
    }
    private static int GetSafeHashCode(object obj) {
        return obj?.GetHashCode() ?? 0;
    }
}
