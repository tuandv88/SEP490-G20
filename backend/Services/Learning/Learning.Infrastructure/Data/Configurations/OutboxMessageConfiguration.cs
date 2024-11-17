namespace Learning.Infrastructure.Data.Configurations;
public class OutboxMessageConfiguration : IEntityTypeConfiguration<OutboxMessage> {
    public void Configure(EntityTypeBuilder<OutboxMessage> builder) {
        builder.HasKey(e => e.Id);

        builder.Property(c => c.Id).HasConversion(
                        outboxMessageId => outboxMessageId.Value,
                        dbId => OutboxMessageId.Of(dbId));

        builder.Property(e => e.Payload).HasColumnType("jsonb");
        builder.Property(e => e.AggregateId).IsRequired();
        builder.Property(e => e.AggregateType).IsRequired();
        builder.Property(e => e.Type).IsRequired();
        builder.Property(e => e.Timestamp).HasColumnType("Timestamp");
    }
}

