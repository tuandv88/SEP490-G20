namespace Learning.Infrastructure.Data.Configurations;
public class UserEnrollmentConfiguration : IEntityTypeConfiguration<UserEnrollment> {
    public void Configure(EntityTypeBuilder<UserEnrollment> builder) {
        builder.HasKey(uc => uc.Id);

        builder.Property(uc => uc.Id).HasConversion(
                        userCourseId => userCourseId.Value,
                        dbId => UserEnrollmentId.Of(dbId));

        builder.Property(uc => uc.UserId).HasConversion(
                        UserId => UserId.Value,
                        dbId => UserId.Of(dbId));

        builder.HasMany(uc => uc.LectureProgress)
            .WithOne()
            .HasForeignKey(uc => uc.UserEnrollmentId);

        builder.Property(uc => uc.EnrollmentDate).HasDefaultValue(DateTime.UtcNow);
        builder.Property(uc => uc.CompletionDate).HasDefaultValue(null);

        builder.Property(uc => uc.UserEnrollmentStatus)
            .HasDefaultValue(UserEnrollmentStatus.InProgress)
            .HasConversion(
                s => s.ToString(), dbStatus => (UserEnrollmentStatus)Enum.Parse(typeof(UserEnrollmentStatus), dbStatus));

        builder.Property(uc => uc.Rating).HasDefaultValue(-1);
        builder.Property(uc => uc.Feedback).HasMaxLength(int.MaxValue);
    }
}

