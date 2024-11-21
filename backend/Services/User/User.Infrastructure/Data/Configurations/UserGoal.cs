
namespace User.Infrastructure.Data.Configurations
{
    public class UserGoalConfiguration : IEntityTypeConfiguration<UserGoal>
    {
        public void Configure(EntityTypeBuilder<UserGoal> builder)
        {
            builder.HasKey(ug => ug.Id);

            builder.Property(c => c.Id).HasConversion(
            userGoalId => userGoalId.Value,
                 dbId => UserGoalId.Of(dbId));


            builder.Property(lp => lp.UserId)
               .HasConversion(
                   userId => userId.Value,
                   dbId => UserId.Of(dbId));

            builder.Property(ug => ug.GoalType).IsRequired();
            builder.Property(ug => ug.TargetDate).IsRequired();
            builder.Property(ug => ug.Status).IsRequired();
        }
    }
}
