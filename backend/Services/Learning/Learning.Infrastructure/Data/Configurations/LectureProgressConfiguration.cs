namespace Learning.Infrastructure.Data.Configurations;
public class LectureProgressConfiguration : IEntityTypeConfiguration<LectureProgress> {
    public void Configure(EntityTypeBuilder<LectureProgress> builder) {
        builder.HasKey(lp => lp.Id);

        builder.Property(lp => lp.Id).HasConversion(
                        lectureProgress => lectureProgress.Value,
                        dbId => LectureProgressId.Of(dbId));
        
        //postgresql phải dung HasAlternateKey vì no khong tạo UNIQUE CONSTRAINT nhu sqlserver
        builder.HasAlternateKey(lp => new {lp.LectureId, lp.UserEnrollmentId});
        builder.Property(uc => uc.CompletionDate).HasDefaultValue(null);
        builder.Property(uc => uc.IsCurrent).HasDefaultValue(false);
        builder.Property(uc => uc.Duration);
    }
}

