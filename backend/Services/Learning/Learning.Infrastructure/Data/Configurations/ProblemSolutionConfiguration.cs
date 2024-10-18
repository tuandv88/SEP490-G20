namespace Learning.Infrastructure.Data.Configurations;
public class ProblemSolutionConfiguration : IEntityTypeConfiguration<ProblemSolution>{
    public void Configure(EntityTypeBuilder<ProblemSolution> builder) {

        builder.HasKey(pl => pl.Id);
        builder.Property(pl => pl.Id).HasConversion(
                        problemSolutionId => problemSolutionId.Value,
                        dbId => ProblemSolutionId.Of(dbId));

        builder.Property(pl => pl.FileName).HasMaxLength(50);

        builder.Property(pl => pl.SolutionCode).HasMaxLength(int.MaxValue);
        builder.Property(pl => pl.Description).HasMaxLength(int.MaxValue);
        
        builder.Property(pl => pl.LanguageCode)
            .HasDefaultValue(LanguageCode.Java)
            .HasConversion(
                s => s.ToString(), dbStatus => (LanguageCode)Enum.Parse(typeof(LanguageCode), dbStatus));
    }
}

