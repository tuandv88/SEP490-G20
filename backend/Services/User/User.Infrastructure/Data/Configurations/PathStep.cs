
namespace User.Infrastructure.Data.Configurations
{
    public class PathStepConfiguration : IEntityTypeConfiguration<PathStep>
    {
        public void Configure(EntityTypeBuilder<PathStep> builder)
        {
            builder.HasKey(ps => ps.Id);

            builder.Property(ps => ps.Id)
                .HasConversion(
                    pathStepId => pathStepId.Value,
                    dbId => PathStepId.Of(dbId));

            builder.Property(ps => ps.CourseId)
              .HasConversion(
                  courseId => courseId.Value,
                  dbId => CourseId.Of(dbId));

            builder.Property(ps => ps.StepOrder).IsRequired();
            builder.Property(ps => ps.Status).IsRequired();
            builder.Property(ps => ps.EnrollmentDate).IsRequired();
            builder.Property(ps => ps.CompletionDate);
            builder.Property(ps => ps.ExpectedCompletionDate).IsRequired();
        }
    }
}
