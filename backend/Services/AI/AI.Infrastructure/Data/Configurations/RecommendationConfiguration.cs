namespace AI.Infrastructure.Data.Configurations;
public class RecommendationConfiguration : IEntityTypeConfiguration<Recommendation> {
    public void Configure(EntityTypeBuilder<Recommendation> builder) {
        builder.HasKey(r => r.Id);

        builder.Property(r => r.Id).HasConversion(
            recommendationId => recommendationId.Value,
            dbId => RecommendationId.Of(dbId));

        builder.Property(c => c.UserId).HasConversion(
                        userId => userId.Value,
                        dbId => UserId.Of(dbId));

        builder.Property(r => r.Name).IsRequired()
            .HasMaxLength(100);

        builder.Property(r => r.Data).IsRequired();
        builder.Property(r => r.Source).IsRequired();
        builder.Property(r => r.Reason).IsRequired();
        builder.Property(r => r.StartDate).IsRequired();
        builder.Property(r => r.EndDate).IsRequired();
    }
}
