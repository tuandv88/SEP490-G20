namespace Learning.Infrastructure.Data.Configurations;
public class CourseConfiguration : IEntityTypeConfiguration<Course>
{
    public void Configure(EntityTypeBuilder<Course> builder)
    {

        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id).HasConversion(
                        courseId => courseId.Value,
                        dbId => CourseId.Of(dbId));

        builder.HasMany(c => c.Chapters)
            .WithOne()
            .HasForeignKey(ci => ci.CourseId);

        builder.HasMany(c => c.UserCourses)
            .WithOne()
            .HasForeignKey(ci => ci.CourseId);

        builder.Property(c => c.Title).IsRequired().HasMaxLength(150);
        builder.Property(c => c.Description).HasMaxLength(int.MaxValue);
        builder.Property(c => c.Headline).HasMaxLength(150);

        builder.Property(c => c.CourseStatus)
            .HasDefaultValue(CourseStatus.Draft)
            .HasConversion(
                s => s.ToString(), dbStatus => (CourseStatus)Enum.Parse(typeof(CourseStatus), dbStatus));

        builder.Property(c => c.TimeEstimation);
        builder.Property(c => c.Prerequisites).HasMaxLength(int.MaxValue);
        builder.Property(c => c.Objectives).HasMaxLength(int.MaxValue);
        builder.Property(c => c.TargetAudiences).HasMaxLength(int.MaxValue);
        builder.Property(c => c.ScheduledPublishDate);
        builder.Property(c => c.ImageUrl);
        builder.Property(c => c.OrderIndex);


        builder.Property(c => c.CourseLevel)
            .HasDefaultValue(CourseLevel.Basic)
            .HasConversion(
                s => s.ToString(), dbStatus => (CourseLevel)Enum.Parse(typeof(CourseLevel), dbStatus));

    }
}

