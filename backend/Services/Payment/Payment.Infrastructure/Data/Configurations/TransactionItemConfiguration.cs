using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Payment.Domain.Enums;
using Payment.Domain.Models;
using Payment.Domain.ValueObjects;

namespace Payment.Infrastructure.Data.Configurations;
public class TransactionItemConfiguration : IEntityTypeConfiguration<TransactionItem> {
    public void Configure(EntityTypeBuilder<TransactionItem> builder) {
        builder.HasKey(t => t.Id);

        builder.Property(t => t.Id).HasConversion(
                        transactionItemId => transactionItemId.Value,
                        dbId => TransactionItemId.Of(dbId));
        builder.Property(t => t.ProductId);

        builder.Property(t => t.ProductType)
          .HasDefaultValue(ProductType.Course)
          .HasConversion(
              s => s.ToString(), dbStatus => (ProductType)Enum.Parse(typeof(ProductType), dbStatus));

        builder.Property(t => t.ProductName);
        builder.Property(t => t.ProductDescription);
        builder.Property(t => t.Quantity);
        builder.Property(t => t.UnitPrice);
    }
}

