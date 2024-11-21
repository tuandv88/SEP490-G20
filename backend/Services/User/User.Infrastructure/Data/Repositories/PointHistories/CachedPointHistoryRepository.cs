using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using User.Application.Models.PointHistories;
using User.Application.Data.Repositories;
using BuildingBlocks.Caching;
using User.Infrastructure.Constants;

namespace User.Infrastructure.Data.Repositories.PointHistories
{
    public class CachedPointHistoryRepository : IPointHistoryRepository
    {
        private readonly IPointHistoryRepository _pointHistoryRepository;
        private readonly ICacheService _cacheService;

        public CachedPointHistoryRepository(IPointHistoryRepository pointHistoryRepository, ICacheService cacheService)
        {
            _pointHistoryRepository = pointHistoryRepository ?? throw new ArgumentNullException(nameof(pointHistoryRepository));
            _cacheService = cacheService ?? throw new ArgumentNullException(nameof(cacheService));
        }

        public async Task AddAsync(PointHistory entity)
        {
            await _pointHistoryRepository.AddAsync(entity);
            RemoveCachedPointHistoryByUserId(entity.UserId.Value);
        }

        public async Task DeleteAsync(PointHistory entity)
        {
            await _pointHistoryRepository.DeleteAsync(entity);
            RemoveCachedPointHistoryByUserId(entity.UserId.Value);
        }

        public async Task DeleteByIdAsync(Guid id)
        {
            await _pointHistoryRepository.DeleteByIdAsync(id);
            var pointHistory = await GetByIdAsync(id);
            if (pointHistory != null)
            {
                RemoveCachedPointHistoryByUserId(pointHistory.UserId.Value);
            }
        }

        public async Task<List<PointHistory>> GetAllAsync()
        {
            return await _pointHistoryRepository.GetAllAsync();
        }

        public async Task<PointHistory?> GetByIdAsync(Guid id)
        {
            // Kiểm tra cache trước
            string cachedKey = string.Format(CacheKey.POINT_HISTORY, id);
            var cachedPointHistory = await _cacheService.GetAsync<PointHistory>(cachedKey);
            if (cachedPointHistory != null)
            {
                return cachedPointHistory;
            }

            // Nếu không có trong cache, truy vấn từ cơ sở dữ liệu
            var pointHistory = await _pointHistoryRepository.GetByIdAsync(id);
            if (pointHistory != null)
            {
                // Lưu vào cache
                await _cacheService.SetAsync(cachedKey, pointHistory);
            }

            return pointHistory;
        }

        public async Task<List<PointHistory>> GetPointHistoryByUserIdAsync(Guid userId)
        {
            // Kiểm tra cache trước
            string cachedKey = string.Format(CacheKey.POINT_HISTORY_BY_USER_ID, userId);
            var cachedPointHistories = await _cacheService.GetAsync<List<PointHistory>>(cachedKey);
            if (cachedPointHistories != null)
            {
                return cachedPointHistories;
            }

            // Nếu không có trong cache, truy vấn từ cơ sở dữ liệu
            var pointHistories = await _pointHistoryRepository.GetPointHistoryByUserIdAsync(userId);
            if (pointHistories.Any())
            {
                // Lưu vào cache
                await _cacheService.SetAsync(cachedKey, pointHistories);
            }

            return pointHistories;
        }

        public async Task UpdateAsync(PointHistory entity)
        {
            await _pointHistoryRepository.UpdateAsync(entity);
            RemoveCachedPointHistoryByUserId(entity.UserId.Value);
        }

        public async Task<int> SaveChangesAsync(CancellationToken cancellationToken)
        {
            return await _pointHistoryRepository.SaveChangesAsync(cancellationToken);
        }

        private async void RemoveCachedPointHistoryByUserId(Guid userId)
        {
            // Xóa cache liên quan đến danh sách PointHistory của UserId
            string cachedKey = string.Format(CacheKey.POINT_HISTORY_BY_USER_ID, userId);
            await _cacheService.DeleteAsync(cachedKey);
        }
    }
}
