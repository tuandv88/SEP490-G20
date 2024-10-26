namespace Learning.Infrastructure.Data.Configurations;
public class UserCourseConfiguration : IEntityTypeConfiguration<UserCourse> {
    public void Configure(EntityTypeBuilder<UserCourse> builder) {
        builder.HasKey(uc => uc.Id);

        builder.Property(uc => uc.Id).HasConversion(
                        userCourseId => userCourseId.Value,
                        dbId => UserCourseId.Of(dbId));

        builder.Property(uc => uc.UserId).HasConversion(
                        UserId => UserId.Value,
                        dbId => UserId.Of(dbId));

        builder.HasMany(uc => uc.LectureProgress)
            .WithOne()
            .HasForeignKey(uc => uc.UserCourseId);

        builder.Property(uc => uc.EnrollmentDate).HasDefaultValue(DateTime.UtcNow);
        builder.Property(uc => uc.CompletionDate).HasDefaultValue(null);

        builder.Property(uc => uc.UserCourseStatus)
            .HasDefaultValue(UserCourseStatus.InProgress)
            .HasConversion(
                s => s.ToString(), dbStatus => (UserCourseStatus)Enum.Parse(typeof(UserCourseStatus), dbStatus));

        builder.Property(uc => uc.Rating).HasDefaultValue(-1);
        builder.Property(uc => uc.Feedback).HasMaxLength(int.MaxValue);
    }
}

