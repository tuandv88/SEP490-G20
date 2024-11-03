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
    }
}
