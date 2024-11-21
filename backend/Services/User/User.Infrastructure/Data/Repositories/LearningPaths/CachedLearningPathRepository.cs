using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using User.Domain.Models;
using User.Infrastructure.Data.Repositories;
using BuildingBlocks.Caching;
using User.Infrastructure.Constants;

namespace User.Infrastructure.Data.Repositories.LearningPaths
{
    public class CachedLearningPathRepository : ILearningPathRepository
    {
        private readonly ILearningPathRepository _learningPathRepository;
        private readonly ICacheService _cacheService;

        public CachedLearningPathRepository(ILearningPathRepository learningPathRepository, ICacheService cacheService)
        {
            _learningPathRepository = learningPathRepository ?? throw new ArgumentNullException(nameof(learningPathRepository));
            _cacheService = cacheService ?? throw new ArgumentNullException(nameof(cacheService));
        }

        public async Task AddAsync(LearningPath entity)
        {
            await _learningPathRepository.AddAsync(entity);
            RemoveCachedLearningPaths(entity.UserId.Value); // Xóa cache khi thêm mới
        }

        public async Task DeleteAsync(LearningPath entity)
        {
            await _learningPathRepository.DeleteAsync(entity);
            RemoveCachedLearningPaths(entity.UserId.Value); // Xóa cache khi xóa
        }

        public async Task DeleteByIdAsync(Guid id)
        {
            var learningPath = await GetByIdAsync(id);
            if (learningPath != null)
            {
                await _learningPathRepository.DeleteByIdAsync(id);
                RemoveCachedLearningPaths(learningPath.UserId.Value);
            }
        }

        public async Task<List<LearningPath>> GetAllAsync()
        {
            // Truy vấn dữ liệu từ cache
            var cachedKey = CacheKey.LEARNING_PATHS;
            var cachedLearningPaths = await _cacheService.GetAsync<List<LearningPath>>(cachedKey);
            if (cachedLearningPaths != null)
            {
                return cachedLearningPaths;
            }

            // Nếu không có trong cache, truy vấn từ cơ sở dữ liệu
            var learningPaths = await _learningPathRepository.GetAllAsync();
            await _cacheService.SetAsync(cachedKey, learningPaths); // Lưu vào cache

            return learningPaths;
        }

        public async Task<LearningPath> GetByIdAsync(Guid id)
        {
            var cachedKey = string.Format(CacheKey.LEARNING_PATH, id);
            var cachedLearningPath = await _cacheService.GetAsync<LearningPath>(cachedKey);
            if (cachedLearningPath != null)
            {
                return cachedLearningPath;
            }

            var learningPath = await _learningPathRepository.GetByIdAsync(id);
            if (learningPath != null)
            {
                await _cacheService.SetAsync(cachedKey, learningPath); // Lưu vào cache
            }

            return learningPath;
        }

        public async Task<List<LearningPath>> GetByUserIdAsync(Guid userId)
        {
            var cachedKey = string.Format(CacheKey.LEARNING_PATHS_BY_USER_ID, userId);
            var cachedLearningPaths = await _cacheService.GetAsync<List<LearningPath>>(cachedKey);
            if (cachedLearningPaths != null)
            {
                return cachedLearningPaths;
            }

            var learningPaths = await _learningPathRepository.GetByUserIdAsync(userId);
            if (learningPaths.Any())
            {
                await _cacheService.SetAsync(cachedKey, learningPaths); // Lưu vào cache
            }

            return learningPaths;
        }

        public async Task<LearningPath> GetByLearningPathIdAsync(Guid learningPathId)
        {
            var cachedKey = string.Format(CacheKey.LEARNING_PATH, learningPathId);
            var cachedLearningPath = await _cacheService.GetAsync<LearningPath>(cachedKey);
            if (cachedLearningPath != null)
            {
                return cachedLearningPath;
            }

            var learningPath = await _learningPathRepository.GetByLearningPathIdAsync(learningPathId);
            if (learningPath != null)
            {
                await _cacheService.SetAsync(cachedKey, learningPath); // Lưu vào cache
            }

            return learningPath;
        }

        public async Task UpdateAsync(LearningPath entity)
        {
            await _learningPathRepository.UpdateAsync(entity);
            RemoveCachedLearningPaths(entity.UserId.Value); // Xóa cache khi cập nhật
        }

        public async Task<int> SaveChangesAsync(CancellationToken cancellationToken)
        {
            return await _learningPathRepository.SaveChangesAsync(cancellationToken);
        }

        private async void RemoveCachedLearningPaths(Guid userId)
        {
            string cachedKey = string.Format(CacheKey.LEARNING_PATHS_BY_USER_ID, userId);
            await _cacheService.DeleteAsync(cachedKey); // Xóa cache liên quan đến UserId
        }
    }
}
