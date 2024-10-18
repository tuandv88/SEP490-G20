namespace Learning.Infrastructure.Data.Configurations;
public class LessonConfiguration : IEntityTypeConfiguration<Lesson> {
    public void Configure(EntityTypeBuilder<Lesson> builder) {
        builder.HasKey(l => l.Id);

        builder.Property(l => l.Id).HasConversion(
                        lessionId => lessionId.Value,
                        dbId => LessonId.Of(dbId));

        builder.HasMany(l => l.Documents)
            .WithOne()
            .HasForeignKey(d => d.LessonId);

        builder.HasOne(l => l.Video)
            .WithOne()
            .HasForeignKey<Video>(d => d.LessonId);

    }
}

