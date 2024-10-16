
namespace Course.Infrastructure.Data.Configurations;
public class QuestionOptionConfiguration : IEntityTypeConfiguration<QuestionOption> {
    public void Configure(EntityTypeBuilder<QuestionOption> builder) {
        builder.HasKey(qo => qo.Id);

        builder.Property(qo => qo.Id).HasConversion(
            questionOptionId => questionOptionId.Value,
                    dbId => QuestionOptionId.Of(dbId));

        builder.Property(qo => qo.Content).HasMaxLength(int.MaxValue);
        builder.Property(qo => qo.IsCorrect);
        builder.Property(qo => qo.OrderIndex);
    }
}

