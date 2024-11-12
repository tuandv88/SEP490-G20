namespace User.Infrastructure.Data.Repositories.UserGoals;

public class UserGoalRepository : Repository<UserGoal> ,IUserGoalRepository
{
    private readonly IApplicationDbContext _dbContext;
    public UserGoalRepository(IApplicationDbContext dbContext) : base(dbContext)
    {
        _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
    }
    public override async Task<UserGoal> GetByIdAsync(Guid id)
    {

        var userGoalId = new UserGoalId(id); 

        var userGoal = await _dbContext.UserGoals
                                        .FirstOrDefaultAsync(ug => ug.Id.Equals(userGoalId));

        if (userGoal == null)
        {
            throw new KeyNotFoundException($"UserGoals với id '{id}' không được tìm thấy.");
        }

        return userGoal;
    }


    public override async Task DeleteByIdAsync(Guid id)
    {
        var UserGoal = await GetByIdAsync(id); 
        if (UserGoal == null)
        {
            throw new KeyNotFoundException($"UserGoals với id '{id}' không được tìm thấy.");
        }

        _dbContext.UserGoals.Remove(UserGoal);
    }
    public async Task<List<UserGoal>> GetByUserIdAsync(Guid userId)
    {
        var userGoals = await _dbContext.UserGoals
            .Where(ug => ug.UserId.Equals(new UserId(userId))) // Lọc theo UserId
            .ToListAsync(); // Lấy tất cả kết quả vào danh sách

        if (userGoals == null || userGoals.Count == 0)
        {
            throw new KeyNotFoundException($"Không có UserGoals nào với UserId '{userId}' được tìm thấy.");
        }

        return userGoals;
    }

}
