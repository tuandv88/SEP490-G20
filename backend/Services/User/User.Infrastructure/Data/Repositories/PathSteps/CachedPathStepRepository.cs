using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using User.Application.Models.PathSteps;
using User.Application.Data.Repositories;
using BuildingBlocks.Caching;
using User.Infrastructure.Constants;

namespace User.Infrastructure.Data.Repositories.PathSteps
{
    public class CachedPathStepRepository : IPathStepsRepository
    {
        private readonly IPathStepsRepository _pathStepsRepository;
        private readonly ICacheService _cacheService;

        public CachedPathStepRepository(IPathStepsRepository pathStepsRepository, ICacheService cacheService)
        {
            _pathStepsRepository = pathStepsRepository ?? throw new ArgumentNullException(nameof(pathStepsRepository));
            _cacheService = cacheService ?? throw new ArgumentNullException(nameof(cacheService));
        }

        public async Task AddAsync(PathStep entity)
        {
            await _pathStepsRepository.AddAsync(entity);
            RemoveCachedPathSteps(entity.LearningPathId.Value); // Xóa cache khi thêm mới
        }

        public async Task DeleteAsync(PathStep entity)
        {
            await _pathStepsRepository.DeleteAsync(entity);
            RemoveCachedPathSteps(entity.LearningPathId.Value); // Xóa cache khi xóa
        }

        public async Task DeleteByIdAsync(Guid id)
        {
            var pathStep = await GetByIdAsync(id);
            if (pathStep != null)
            {
                await _pathStepsRepository.DeleteByIdAsync(id);
                RemoveCachedPathSteps(pathStep.LearningPathId.Value);
            }
        }

        public async Task<List<PathStep>> GetAllAsync()
        {
            // Truy vấn dữ liệu từ cache
            var cachedKey = CacheKey.PATH_STEPS;
            var cachedPathSteps = await _cacheService.GetAsync<List<PathStep>>(cachedKey);
            if (cachedPathSteps != null)
            {
                return cachedPathSteps;
            }

            // Nếu không có trong cache, truy vấn từ cơ sở dữ liệu
            var pathSteps = await _pathStepsRepository.GetAllAsync();
            await _cacheService.SetAsync(cachedKey, pathSteps); // Lưu vào cache

            return pathSteps;
        }

        public async Task<PathStep> GetByIdAsync(Guid id)
        {
            var cachedKey = string.Format(CacheKey.PATH_STEP, id);
            var cachedPathStep = await _cacheService.GetAsync<PathStep>(cachedKey);
            if (cachedPathStep != null)
            {
                return cachedPathStep;
            }

            var pathStep = await _pathStepsRepository.GetByIdAsync(id);
            if (pathStep != null)
            {
                await _cacheService.SetAsync(cachedKey, pathStep); // Lưu vào cache
            }

            return pathStep;
        }

        public async Task<List<PathStep>> GetByLearningPathIDAsync(Guid learningPathId)
        {
            var cachedKey = string.Format(CacheKey.PATH_STEPS_BY_LEARNING_PATH_ID, learningPathId);
            var cachedPathSteps = await _cacheService.GetAsync<List<PathStep>>(cachedKey);
            if (cachedPathSteps != null)
            {
                return cachedPathSteps;
            }

            var pathSteps = await _pathStepsRepository.GetByLearningPathIDAsync(learningPathId);
            if (pathSteps.Any())
            {
                await _cacheService.SetAsync(cachedKey, pathSteps); // Lưu vào cache
            }

            return pathSteps;
        }

        public async Task<PathStep> GetByPathStepIdAsync(Guid pathStepId)
        {
            var cachedKey = string.Format(CacheKey.PATH_STEP, pathStepId);
            var cachedPathStep = await _cacheService.GetAsync<PathStep>(cachedKey);
            if (cachedPathStep != null)
            {
                return cachedPathStep;
            }

            var pathStep = await _pathStepsRepository.GetByPathStepIdAsync(pathStepId);
            if (pathStep != null)
            {
                await _cacheService.SetAsync(cachedKey, pathStep); // Lưu vào cache
            }

            return pathStep;
        }

        public async Task UpdateAsync(PathStep entity)
        {
            await _pathStepsRepository.UpdateAsync(entity);
            RemoveCachedPathSteps(entity.LearningPathId.Value); // Xóa cache khi cập nhật
        }

        public async Task<int> SaveChangesAsync(CancellationToken cancellationToken)
        {
            return await _pathStepsRepository.SaveChangesAsync(cancellationToken);
        }

        private async void RemoveCachedPathSteps(Guid learningPathId)
        {
            string cachedKey = string.Format(CacheKey.PATH_STEPS_BY_LEARNING_PATH_ID, learningPathId);
            await _cacheService.DeleteAsync(cachedKey); // Xóa cache liên quan đến LearningPathId
        }
    }
}
