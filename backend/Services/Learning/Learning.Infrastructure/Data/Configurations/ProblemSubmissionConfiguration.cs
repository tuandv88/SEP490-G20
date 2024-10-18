
using System.Text.Json;

namespace Learning.Infrastructure.Data.Configurations;
public class ProblemSubmissionConfiguration : IEntityTypeConfiguration<ProblemSubmission> {
    public void Configure(EntityTypeBuilder<ProblemSubmission> builder) {
        builder.HasKey(ps => ps.Id);
        builder.Property(ps => ps.Id).HasConversion(
                        problemSubmissionId => problemSubmissionId.Value,
                        dbId => ProblemSubmissionId.Of(dbId));

        builder.Property(uc => uc.UserId).HasConversion(
                        UserId => UserId.Value,
                        dbId => UserId.Of(dbId));

        builder.Property(ps => ps.SubmissionDate).HasDefaultValue(DateTime.UtcNow);
        builder.Property(ps => ps.SourceCode).HasMaxLength(int.MaxValue);
        builder.Property(ps => ps.LanguageCode).HasDefaultValue(LanguageCode.Java);
        builder.Property(ps => ps.ExecutionTime);
        builder.Property(ps => ps.MemoryUsage);

        builder.Property(ps => ps.TestCasesPassed).HasConversion(
                    testCasesPassed => JsonSerializer.Serialize(testCasesPassed, (JsonSerializerOptions)null!),
                    dbJson => JsonSerializer.Deserialize<JsonDocument>(dbJson, (JsonSerializerOptions)null!)!
                );
        builder.Property(ps => ps.TestCasesFailed).HasConversion(
                    testCasesFailed => JsonSerializer.Serialize(testCasesFailed, (JsonSerializerOptions)null!),
                    dbJson => JsonSerializer.Deserialize<JsonDocument>(dbJson, (JsonSerializerOptions)null!)!
                );
        builder.Property(ps => ps.RunTimeErrors);
    }
}

