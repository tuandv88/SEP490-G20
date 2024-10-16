
namespace Course.Infrastructure.Data.Configurations;
public class ProblemTestCaseConfiguration : IEntityTypeConfiguration<ProblemTestCase> {
    public void Configure(EntityTypeBuilder<ProblemTestCase> builder) {
        builder.HasKey(pt => pt.Id);
        builder.Property(pt => pt.Id).HasConversion(
                        problemTestCaseId => problemTestCaseId.Value,
                        dbId => ProblemTestCaseId.Of(dbId));

        builder.Property(pt => pt.Input).HasMaxLength(int.MaxValue);
        builder.Property(pt => pt.ExpectedOutput).HasMaxLength(int.MaxValue);
    }
}

