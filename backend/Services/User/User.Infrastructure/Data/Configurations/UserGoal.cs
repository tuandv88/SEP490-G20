
namespace User.Infrastructure.Data.Configurations
{
    public class UserGoalConfiguration : IEntityTypeConfiguration<UserGoal>
    {
        public void Configure(EntityTypeBuilder<UserGoal> builder)
        {
            builder.HasKey(ug => ug.Id);

            builder.Property(ug => ug.Id).IsRequired();
            builder.Property(ug => ug.UserId).IsRequired();
            builder.Property(ug => ug.GoalType).IsRequired();
            builder.Property(ug => ug.TargetDate).IsRequired();
            builder.Property(ug => ug.Status).IsRequired();
        }
    }
}
