using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using User.Domain.Models;
using User.Infrastructure.Data.Repositories;
using BuildingBlocks.Caching;
using User.Infrastructure.Constants;

namespace User.Infrastructure.Data.Repositories.UserGoals
{
    public class CachedUserGoalRepository : IUserGoalRepository
    {
        private readonly IUserGoalRepository _userGoalRepository;
        private readonly ICacheService _cacheService;

        public CachedUserGoalRepository(IUserGoalRepository userGoalRepository, ICacheService cacheService)
        {
            _userGoalRepository = userGoalRepository ?? throw new ArgumentNullException(nameof(userGoalRepository));
            _cacheService = cacheService ?? throw new ArgumentNullException(nameof(cacheService));
        }

        public async Task AddAsync(UserGoal entity)
        {
            await _userGoalRepository.AddAsync(entity);
            RemoveCachedUserGoals(entity.UserId.Value); // Xóa cache khi thêm mới
        }

        public async Task DeleteAsync(UserGoal entity)
        {
            await _userGoalRepository.DeleteAsync(entity);
            RemoveCachedUserGoals(entity.UserId.Value); // Xóa cache khi xóa
        }

        public async Task DeleteByIdAsync(Guid id)
        {
            var userGoal = await GetByIdAsync(id);
            if (userGoal != null)
            {
                await _userGoalRepository.DeleteByIdAsync(id);
                RemoveCachedUserGoals(userGoal.UserId.Value); // Xóa cache khi xóa
            }
        }

        public async Task<List<UserGoal>> GetAllAsync()
        {
            var cachedKey = CacheKey.USER_GOALS;
            var cachedUserGoals = await _cacheService.GetAsync<List<UserGoal>>(cachedKey);
            if (cachedUserGoals != null)
            {
                return cachedUserGoals;
            }

            var userGoals = await _userGoalRepository.GetAllAsync();
            await _cacheService.SetAsync(cachedKey, userGoals); // Lưu vào cache

            return userGoals;
        }

        public async Task<UserGoal> GetByIdAsync(Guid id)
        {
            var cachedKey = string.Format(CacheKey.USER_GOAL, id);
            var cachedUserGoal = await _cacheService.GetAsync<UserGoal>(cachedKey);
            if (cachedUserGoal != null)
            {
                return cachedUserGoal;
            }

            var userGoal = await _userGoalRepository.GetByIdAsync(id);
            if (userGoal != null)
            {
                await _cacheService.SetAsync(cachedKey, userGoal); // Lưu vào cache
            }

            return userGoal;
        }

        public async Task<List<UserGoal>> GetByUserIdAsync(Guid userId)
        {
            var cachedKey = string.Format(CacheKey.USER_GOALS_BY_USER_ID, userId);
            var cachedUserGoals = await _cacheService.GetAsync<List<UserGoal>>(cachedKey);
            if (cachedUserGoals != null)
            {
                return cachedUserGoals;
            }

            var userGoals = await _userGoalRepository.GetByUserIdAsync(userId);
            if (userGoals.Any())
            {
                await _cacheService.SetAsync(cachedKey, userGoals); // Lưu vào cache
            }

            return userGoals;
        }

        public async Task UpdateAsync(UserGoal entity)
        {
            await _userGoalRepository.UpdateAsync(entity);
            RemoveCachedUserGoals(entity.UserId.Value); // Xóa cache khi cập nhật
        }

        public async Task<int> SaveChangesAsync(CancellationToken cancellationToken)
        {
            return await _userGoalRepository.SaveChangesAsync(cancellationToken);
        }

        private async void RemoveCachedUserGoals(Guid userId)
        {
            string cachedKey = string.Format(CacheKey.USER_GOALS_BY_USER_ID, userId);
            await _cacheService.DeleteAsync(cachedKey); // Xóa cache khi có thay đổi về UserGoals
        }
    }
}
