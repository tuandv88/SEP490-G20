namespace Payment.Infrastructure.Data.Configurations;
public class TransactionConfiguration : IEntityTypeConfiguration<Transaction> {
    public void Configure(EntityTypeBuilder<Transaction> builder) {
        builder.HasKey(t => t.Id);

        builder.Property(t => t.Id).HasConversion(
                        transactionId => transactionId.Value,
                        dbId => TransactionId.Of(dbId));

        builder.Property(t => t.UserId).HasConversion(
                        userId => userId.Value,
                        dbId => UserId.Of(dbId));

        builder.Property(t => t.Amount);
        builder.Property(t => t.Currency);
        builder.Property(t => t.Status)
           .HasDefaultValue(TransactionStatus.Pending)
           .HasConversion(
               s => s.ToString(), dbStatus => (TransactionStatus)Enum.Parse(typeof(TransactionStatus), dbStatus));

        builder.Property(t => t.PaymentMethod)
           .HasDefaultValue(PaymentMethod.Paypal)
           .HasConversion(
               s => s.ToString(), dbStatus => (PaymentMethod)Enum.Parse(typeof(PaymentMethod), dbStatus));

        builder.Property(t => t.ExternalOrderId);
        builder.Property(t => t.ExternalTransactionId);
        builder.Property(t => t.GrossAmount);
        builder.Property(t => t.NetAmount);
        builder.Property(t => t.FeeAmount);
        builder.Property(t => t.PayerId);
        builder.Property(t => t.PayerEmail);
        builder.Property(t => t.PayerPhone);

        builder.HasMany(t => t.Items)
            .WithOne()
            .HasForeignKey(t => t.TransactionId);

    }
}

