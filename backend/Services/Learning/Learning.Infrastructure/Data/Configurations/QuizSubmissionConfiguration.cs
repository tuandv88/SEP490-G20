
using System.Text.Json;

namespace Learning.Infrastructure.Data.Configurations;
public class QuizSubmissionConfiguration : IEntityTypeConfiguration<QuizSubmission> {
    public void Configure(EntityTypeBuilder<QuizSubmission> builder) {
        builder.HasKey(qs => qs.Id);
        builder.Property(qs => qs.Id).HasConversion(
                        quizSubmissionId => quizSubmissionId.Value,
                        dbId => QuizSubmissionId.Of(dbId));

        builder.Property(uc => uc.UserId).HasConversion(
                        UserId => UserId.Value,
                        dbId => UserId.Of(dbId));

        builder.Property(ps => ps.SubmissionDate).HasDefaultValue(DateTime.UtcNow);
        builder.Property(ps => ps.Score);
        builder.Property(ps => ps.TotalQuestions);
        builder.Property(ps => ps.CorrectAnswers);
        builder.Property(ps => ps.IncorrectAnswers);
        builder.Property(ps => ps.Duration);

        builder.Property(ps => ps.Answers).HasConversion(
                    answers => JsonSerializer.Serialize(answers, (JsonSerializerOptions)null!),
                    dbJson => JsonSerializer.Deserialize<JsonDocument>(dbJson, (JsonSerializerOptions)null!)!
                );
    }
}

