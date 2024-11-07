using Microsoft.EntityFrameworkCore.ChangeTracking;
using Newtonsoft.Json;

namespace AI.Infrastructure.Data.Configurations;
public class ConversationConfiguration : IEntityTypeConfiguration<Conversation> {
    public void Configure(EntityTypeBuilder<Conversation> builder) {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Id).HasConversion(
                        conversationId => conversationId.Value,
                        dbId => ConversationId.Of(dbId));

        builder.Property(c => c.UserId).HasConversion(
                        userId => userId.Value,
                        dbId => UserId.Of(dbId));
        builder.Property(c => c.Title).IsRequired().HasMaxLength(100);


        builder.Property(c => c.Context)
            .HasConversion(
                v => JsonConvert.SerializeObject(v),
                v => JsonConvert.DeserializeObject<Dictionary<string, object>>(v ?? "{}")!)
            .Metadata.SetValueComparer(new ValueComparer<Dictionary<string, object>>(
                (d1, d2) => d1.Count == d2.Count && !d1.Except(d2).Any(),
                d => d.Aggregate(0, (hash, kvp) => HashCode.Combine(hash, kvp.Key.GetHashCode(), GetSafeHashCode(kvp.Value))),
                d => d.ToDictionary(kvp => kvp.Key, kvp => kvp.Value)
            ));

        builder.HasMany(c => c.Messages)
           .WithOne()
           .HasForeignKey(c => c.ConversationId);
    }
    private static int GetSafeHashCode(object obj) {
        return obj?.GetHashCode() ?? 0;
    }
}

