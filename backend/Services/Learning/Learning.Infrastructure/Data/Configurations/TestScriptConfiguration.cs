
namespace Learning.Infrastructure.Data.Configurations;
public class TestScriptConfiguration : IEntityTypeConfiguration<TestScript> {
    public void Configure(EntityTypeBuilder<TestScript> builder) {
        builder.HasKey(pl => pl.Id);
        builder.Property(pl => pl.Id).HasConversion(
                        testScriptId => testScriptId.Value,
                        dbId => TestScriptId.Of(dbId));

        builder.Property(pl => pl.FileName).HasMaxLength(50);
        builder.Property(pl => pl.Template).HasMaxLength(int.MaxValue);
        builder.Property(pl => pl.TestCode).HasMaxLength(int.MaxValue);
        builder.Property(pl => pl.Description).HasMaxLength(int.MaxValue);

        builder.Property(pl => pl.LanguageCode)
            .HasDefaultValue(LanguageCode.Java)
            .HasConversion(
                s => s.ToString(), dbStatus => (LanguageCode)Enum.Parse(typeof(LanguageCode), dbStatus));
    }
}

