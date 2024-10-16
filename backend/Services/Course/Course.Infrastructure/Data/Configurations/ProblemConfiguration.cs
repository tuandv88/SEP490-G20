namespace Course.Infrastructure.Data.Configurations;
public class ProblemConfiguration : IEntityTypeConfiguration<Problem> {
    public void Configure(EntityTypeBuilder<Problem> builder) {
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id).HasConversion(
                        problemId => problemId.Value,
                        dbId => ProblemId.Of(dbId));

        builder.HasMany(p => p.ProblemSolutions)
            .WithOne()
            .HasForeignKey(p => p.ProblemId);

        builder.Property(p => p.Title).IsRequired().HasMaxLength(150);
        builder.Property(p => p.Description).HasMaxLength(int.MaxValue);

        builder.Property(p => p.ProblemType)
            .HasDefaultValue(ProblemType.Practice)
            .HasConversion(
                p => p.ToString(), dbStatus => (ProblemType)Enum.Parse(typeof(ProblemType), dbStatus));

        builder.Property(p => p.DifficultyType)
            .HasDefaultValue(DifficultyType.Easy)
            .HasConversion(
                p => p.ToString(), dbStatus => (DifficultyType)Enum.Parse(typeof(DifficultyType), dbStatus));

        builder.Property(p => p.CpuTimeLimit);
        builder.Property(p => p.CpuExtraTime);
        builder.Property(p => p.MemoryLimit);
        builder.Property(p => p.EnableNetwork);
        builder.Property(p => p.StackLimit);
        builder.Property(p => p.MaxThread);
        builder.Property(p => p.MaxFileSize);

    }
}

