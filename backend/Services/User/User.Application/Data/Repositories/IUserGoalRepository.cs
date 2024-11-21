namespace User.Application.Data.Repositories;

public interface IUserGoalRepository : IRepository<UserGoal>
{
    Task<List<UserGoal>> GetByUserIdAsync(Guid userId);
}
