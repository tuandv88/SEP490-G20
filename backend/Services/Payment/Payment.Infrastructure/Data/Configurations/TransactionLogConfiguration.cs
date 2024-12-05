using Microsoft.EntityFrameworkCore;
using Payment.Domain.ValueObjects;

namespace Payment.Infrastructure.Data.Configurations;
public class TransactionLogConfiguration : IEntityTypeConfiguration<TransactionLog> {
    public void Configure(EntityTypeBuilder<TransactionLog> builder) {
        builder.HasKey(t => t.Id);

        builder.Property(t => t.Id).HasConversion(
                        transactionLogId => transactionLogId.Value,
                        dbId => TransactionLogId.Of(dbId));

        builder.Property(t => t.Action);
        builder.Property(t => t.Status);
        builder.Property(t => t.Description);
    }
}

