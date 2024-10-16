
namespace Course.Infrastructure.Data.Configurations;
public class QuestionConfiguration : IEntityTypeConfiguration<Question> {
    public void Configure(EntityTypeBuilder<Question> builder) {
        builder.HasKey(q => q.Id);

        builder.Property(q => q.Id).HasConversion(
            questionId => questionId.Value,
                    dbId => QuestionId.Of(dbId));

        builder.HasMany(c => c.QuestionOptions)
          .WithOne()
          .HasForeignKey(ci => ci.QuestionId);

        builder.Property(q => q.Content);
        builder.Property(q => q.QuestionType)
            .HasDefaultValue(QuestionType.MultipleChoice)
            .HasConversion(
                s => s.ToString(), dbStatus => (QuestionType)Enum.Parse(typeof(QuestionType), dbStatus));

        builder.Property(q => q.Mark);
        builder.Property(q => q.OrderIndex);

    }
}

