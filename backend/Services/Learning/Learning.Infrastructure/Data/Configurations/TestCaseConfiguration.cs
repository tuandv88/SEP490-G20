
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Newtonsoft.Json;

namespace Learning.Infrastructure.Data.Configurations;
public class TestCaseConfiguration : IEntityTypeConfiguration<TestCase> {
    public void Configure(EntityTypeBuilder<TestCase> builder) {
        builder.HasKey(tc => tc.Id);
        builder.Property(tc => tc.Id).HasConversion(
                        testCaseId => testCaseId.Value,
                        dbId => TestCaseId.Of(dbId));

        builder.Property(tc => tc.Inputs)
            .HasConversion(
                input => JsonConvert.SerializeObject(input),
                dbJson => JsonConvert.DeserializeObject<Dictionary<string, string>>(dbJson ?? "{}")!)
            .Metadata.SetValueComparer(new ValueComparer<Dictionary<string, string>>(
                (c1, c2) => c1.Count == c2.Count && !c1.Except(c2).Any(),
                c => c.Aggregate(0, (hash, kvp) => HashCode.Combine(hash, kvp.Key.GetHashCode(), kvp.Value.GetHashCode())),
                c => c.ToDictionary(kvp => kvp.Key, kvp => kvp.Value)
            ));

        builder.Property(tc => tc.ExpectedOutput).HasMaxLength(int.MaxValue);
        builder.Property(tc => tc.IsHidden).HasDefaultValue(true);
        builder.Property(tc => tc.OrderIndex);
    }
}

