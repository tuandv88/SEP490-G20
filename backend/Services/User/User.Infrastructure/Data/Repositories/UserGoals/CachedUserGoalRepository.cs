//namespace User.Infrastructure.Data.Repositories.UserGoals;

//public class CachedUserGoalRepository(IUserGoalRepository repository, ICacheService cacheService) : IUserGoalRepository
//{
//    public async Task AddAsync(UserGoal entity)
//    {
//        await repository.AddAsync(entity);
//        DeleteCached(string.Format(CacheKey.USER_GOALS, entity.UserId.Value));
//    }

//    public async Task DeleteAsync(UserGoal entity)
//    {
//        await repository.DeleteAsync(entity);
//        DeleteCached(string.Format(CacheKey.USER_GOALS, entity.UserId.Value));
//    }

//    public async Task DeleteByIdAsync(Guid id)
//    {
//        var userGoal = await GetByIdAsync(id);
//        if (userGoal != null)
//        {
//            await repository.DeleteByIdAsync(id);
//            DeleteCached(string.Format(CacheKey.USER_GOALS, userGoal.UserId.Value));
//        }
//    }

//    public async Task<List<UserGoal>> GetAllAsync()
//    {
//        return await repository.GetAllAsync();
//    }

//    public async Task<UserGoal?> GetByIdAsync(Guid id)
//    {
//        return await repository.GetByIdAsync(id);
//    }

//    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken)
//    {
//        return await repository.SaveChangesAsync(cancellationToken);
//    }

//    public async Task UpdateAsync(UserGoal entity)
//    {
//        await repository.UpdateAsync(entity);
//        DeleteCached(string.Format(CacheKey.USER_GOALS, entity.UserId.Value));
//    }

//    private void DeleteCached(string cachedKey)
//    {
//        _ = cacheService.DeleteAsync(cachedKey);
//    }
//}
