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

        builder.HasMany(c => c.Messages)
           .WithOne()
           .HasForeignKey(c => c.ConversationId);
    }

}

