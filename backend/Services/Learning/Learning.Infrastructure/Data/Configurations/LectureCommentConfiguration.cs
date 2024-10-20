namespace Learning.Infrastructure.Data.Configurations;
public class LectureCommentConfiguration : IEntityTypeConfiguration<LectureComment> {
    public void Configure(EntityTypeBuilder<LectureComment> builder) {
        builder.HasKey(lc => lc.Id);

        builder.Property(lc => lc.Id).HasConversion(
                        lectureComment => lectureComment.Value,
                        dbId => LectureCommentId.Of(dbId));

        builder.Property(lc => lc.UserId).HasConversion(
                        UserId => UserId.Value,
                        dbId => UserId.Of(dbId));

        builder.Property(lc => lc.Content).HasMaxLength(int.MaxValue);
    }
}

