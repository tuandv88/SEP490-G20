namespace User.Infrastructure.Data.Configurations
{
    public class LearningPathConfiguration : IEntityTypeConfiguration<LearningPath>
    {
        public void Configure(EntityTypeBuilder<LearningPath> builder)
        {
            builder.HasKey(lp => lp.Id);

            builder.Property(lp => lp.Id)
                .HasConversion(
                    learningPathId => learningPathId.Value,
                    dbId => LearningPathId.Of(dbId));

            builder.Property(lp => lp.UserId)
               .HasConversion(
                   userId => userId.Value,
                   dbId => UserId.Of(dbId));

            builder.Property(lp => lp.PathName).IsRequired().HasMaxLength(150);
            builder.Property(lp => lp.StartDate).IsRequired();
            builder.Property(lp => lp.EndDate).IsRequired();
            builder.Property(lp => lp.Status).IsRequired();
            builder.Property(lp => lp.Reason);
            builder.HasMany(lp => lp.PathSteps)
                .WithOne()
                .HasForeignKey(ps => ps.LearningPathId);
        }
    }
}
