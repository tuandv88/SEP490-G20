using Newtonsoft.Json;
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

        builder.Property(ps => ps.StartTime).HasDefaultValue(DateTime.UtcNow);
        builder.Property(ps => ps.SubmissionDate).HasDefaultValue(DateTime.UtcNow);
        builder.Property(ps => ps.Score);
        builder.Property(ps => ps.TotalQuestions);
        builder.Property(ps => ps.CorrectAnswers);
        builder.Property(ps => ps.PassingMark);
        builder.Property(ps => ps.TotalScore);
        builder.Ignore(ps => ps.Duration);

        builder.Property(ps => ps.Answers).HasConversion(
                    answers => JsonConvert.SerializeObject(answers),
                    dbJson => JsonConvert.DeserializeObject<List<QuestionAnswer>>(dbJson)!
                );

        builder.Property(c => c.Status)
           .HasDefaultValue(QuizSubmissionStatus.InProgress)
           .HasConversion(
               s => s.ToString(), dbStatus => (QuizSubmissionStatus)Enum.Parse(typeof(QuizSubmissionStatus), dbStatus));
    }
}

