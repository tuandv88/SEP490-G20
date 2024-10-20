
namespace Learning.Infrastructure.Data.Configurations;
public class TestCaseConfiguration : IEntityTypeConfiguration<TestCase> {
    public void Configure(EntityTypeBuilder<TestCase> builder) {
        builder.HasKey(tc => tc.Id);
        builder.Property(tc => tc.Id).HasConversion(
                        testCaseId => testCaseId.Value,
                        dbId => TestCaseId.Of(dbId));

        builder.Property(tc => tc.Input).HasMaxLength(int.MaxValue);
        builder.Property(tc => tc.ExpectedOutput).HasMaxLength(int.MaxValue);
        builder.Property(tc => tc.IsHidden).HasDefaultValue(true);
        builder.Property(tc => tc.OrderIndex);
    }
}

