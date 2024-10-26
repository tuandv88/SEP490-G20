using Microsoft.EntityFrameworkCore.ChangeTracking;
using Newtonsoft.Json;

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

        builder.Property(ps => ps.LanguageCode)
            .HasDefaultValue(LanguageCode.Java)
            .HasConversion(
                s => s.ToString(), dbStatus => (LanguageCode)Enum.Parse(typeof(LanguageCode), dbStatus));
        builder.Property(ps => ps.ExecutionTime);
        builder.Property(ps => ps.MemoryUsage);

        builder.Property(ps => ps.TestResults)
            .HasConversion(
                testResult => JsonConvert.SerializeObject(testResult),
                dbJson => JsonConvert.DeserializeObject<List<TestResult>>(dbJson)!)
            .Metadata.SetValueComparer(new ValueComparer<List<TestResult>>(
                (c1, c2) => JsonConvert.SerializeObject(c1) == JsonConvert.SerializeObject(c2),
                c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                c => JsonConvert.DeserializeObject<List<TestResult>>(JsonConvert.SerializeObject(c))!));

        builder.Property(ps => ps.Status).HasConversion(
                    status => JsonConvert.SerializeObject(status),
                    dbJson => JsonConvert.DeserializeObject<SubmissionStatus>(dbJson)!
                );
        builder.Property(ps => ps.TokenReference);
        builder.Property(ps => ps.RunTimeErrors).HasDefaultValue(null);
        builder.Property(ps => ps.CompileErrors).HasDefaultValue(null);
    }
}

