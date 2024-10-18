namespace Learning.Infrastructure.Data.Configurations;
public class LectureConfiguration : IEntityTypeConfiguration<Lecture> {
    public void Configure(EntityTypeBuilder<Lecture> builder) {
        builder.HasKey(l => l.Id);

        builder.Property(l => l.Id).HasConversion(
                        lecture => lecture.Value,
                        dbId => LectureId.Of(dbId));

        builder.HasOne<Lesson>()
               .WithOne()
               .HasForeignKey<Lecture>(l => l.LessonId);

        builder.HasIndex(l => l.LessonId).IsUnique();

        builder.HasOne<Problem>()
               .WithOne()
               .HasForeignKey<Lecture>(l => l.ProblemId);

        builder.HasIndex(l => l.ProblemId).IsUnique();

        builder.HasOne<Quiz>()
               .WithOne()
               .HasForeignKey<Lecture>(l => l.QuizId);

        builder.HasMany(l => l.LectureProgress)
            .WithOne()
            .HasForeignKey(l => l.LectureId);

        builder.HasMany(l => l.LectureComments)
            .WithOne()
            .HasForeignKey(l => l.LectureId);
        builder.HasIndex(l => l.QuizId).IsUnique();

        builder.Property(c => c.Title).IsRequired();
        builder.Property(c => c.TimeEstimation);

        builder.Property(l => l.LectureType)
            .HasDefaultValue(LectureType.Lesson)
            .HasConversion(
                s => s.ToString(), dbStatus => (LectureType)Enum.Parse(typeof(LectureType), dbStatus));

        builder.Property(l => l.OrderIndex);
        builder.Property(l => l.Point);
        builder.Property(l => l.IsFree);
    }
}

