namespace Course.Infrastructure.Data.Configurations;
public class QuizConfiguration : IEntityTypeConfiguration<Quiz> {
    public void Configure(EntityTypeBuilder<Quiz> builder) {
        builder.HasKey(q => q.Id);
        builder.Property(q => q.Id).HasConversion(
                        quizId => quizId.Value,
                        dbId => QuizId.Of(dbId));

        builder.HasMany(c => c.Questions)
           .WithOne()
           .HasForeignKey(ci => ci.QuizId);

        builder.Property(q => q.IsActive).HasDefaultValue(true);
        builder.Property(q => q.IsRandomized).HasDefaultValue(false);
        builder.Property(q => q.Title).HasMaxLength(int.MaxValue);
        builder.Property(q => q.Description).HasMaxLength(int.MaxValue);
        builder.Property(q => q.PassingMark);
        builder.Property(q => q.TimeLimit);
        builder.Property(q => q.HasTimeLimit).HasDefaultValue(false);
        builder.Property(q => q.AttemptLimit).HasDefaultValue(1);
        builder.Property(q => q.HasAttemptLimit).HasDefaultValue(false);
    }
}

