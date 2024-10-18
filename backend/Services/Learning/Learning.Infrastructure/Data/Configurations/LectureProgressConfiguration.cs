namespace Learning.Infrastructure.Data.Configurations;
public class LectureProgressConfiguration : IEntityTypeConfiguration<LectureProgress> {
    public void Configure(EntityTypeBuilder<LectureProgress> builder) {
        builder.HasKey(lp => lp.Id);

        builder.Property(lp => lp.Id).HasConversion(
                        lectureProgress => lectureProgress.Value,
                        dbId => LectureProgressId.Of(dbId));
        builder.Property(uc => uc.CompletionDate).HasDefaultValue(null);
        builder.Property(uc => uc.IsCurrent).HasDefaultValue(false);
        builder.Property(uc => uc.Notes).HasMaxLength(int.MaxValue);
        builder.Property(uc => uc.Duration);
    }
}

