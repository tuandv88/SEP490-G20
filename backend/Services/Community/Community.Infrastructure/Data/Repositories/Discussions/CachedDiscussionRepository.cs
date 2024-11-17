using Community.Infrastructure.Constants;

namespace Community.Infrastructure.Data.Repositories.Discussions;

public class CachedDiscussionRepository : IDiscussionRepository
{
    private readonly IDiscussionRepository _discussionRepository;
    private readonly ICacheService _cacheService;

    public CachedDiscussionRepository(IDiscussionRepository discussionRepository, ICacheService cacheService)
    {
        _discussionRepository = discussionRepository;
        _cacheService = cacheService;
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken)
    {
        int number = await _discussionRepository.SaveChangesAsync(cancellationToken);
        return number;
    }

    private void DeleteCached(string cachedKey)
    {
        _ = _cacheService.DeleteAsync(cachedKey);
    }

    public async Task AddAsync(Discussion entity)
    {
        await _discussionRepository.AddAsync(entity);
        // Xóa cached
        DeleteCached(CacheKey.COMMUNITY_DISCUSSIONS);
    }

    public async Task UpdateAsync(Discussion entity)
    {
        await _discussionRepository.UpdateAsync(entity);
        // Xóa cached
        DeleteCached(CacheKey.COMMUNITY_DISCUSSIONS);
        DeleteCached(string.Format(CacheKey.COMMUNITY_DISCUSSIONS_DETAILS, entity.Id.Value));
    }

    public async Task DeleteAsync(Discussion entity)
    {
        await _discussionRepository.DeleteAsync(entity);
        // Xóa cached
        DeleteCached(CacheKey.COMMUNITY_DISCUSSIONS);
        DeleteCached(string.Format(CacheKey.COMMUNITY_DISCUSSIONS_DETAILS, entity.Id.Value));
    }

    public async Task DeleteByIdAsync(Guid id)
    {
        await _discussionRepository.DeleteByIdAsync(id);
        // Xóa cached
        DeleteCached(CacheKey.COMMUNITY_DISCUSSIONS);
        DeleteCached(string.Format(CacheKey.COMMUNITY_DISCUSSIONS_DETAILS, id));
    }

    public async Task<List<Discussion>> GetAllAsync()
    {
        var cachedKey = CacheKey.COMMUNITY_DISCUSSIONS;

        var cachedData = await _cacheService.GetAsync<List<Discussion>>(cachedKey);

        if (cachedData == null || !cachedData.Any())
        {
            var allData = await _discussionRepository.GetAllAsync();

            _ = _cacheService.SetAsync(cachedKey, allData);

            return allData;
        }
        else
        {
            return cachedData;
        }
    }

    public async Task<Discussion?> GetByIdAsync(Guid id)
    {
        var discussion = await _discussionRepository.GetByIdAsync(id);
        return discussion;
    }

    public async Task<Discussion?> GetByIdDetailAsync(Guid id)
    {
        var allData = await _discussionRepository.GetByIdDetailAsync(id);

        return allData;
    }


    public async Task<IQueryable<Discussion>?> GetByCategoryIdAsync(Guid id)
    {
        var allData = await _discussionRepository.GetByCategoryIdAsync(id);

        return allData;
    }

    public async Task<IQueryable<Discussion>?> GetByCategoryIdIsActiveAsync(Guid id)
    {
        var allData = await _discussionRepository.GetByCategoryIdIsActiveAsync(id);

        return allData;
    }

    public async Task<List<Discussion>?> GetAllDetailIsActiveAsync()
    {
        var cachedKey = CacheKey.COMMUNITY_DISCUSSIONS_DETAILS;

        var cachedData = await _cacheService.GetAsync<List<Discussion>>(cachedKey);

        if (cachedData == null || !cachedData.Any())
        {
            var allData = await _discussionRepository.GetAllDetailIsActiveAsync();


            _ = _cacheService.SetAsync(cachedKey, allData);

            return allData;
        }
        else
        {
            return cachedData;
        }
    }
}
