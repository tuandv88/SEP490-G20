namespace Learning.Infrastructure.Data.Repositories.Chapters;

public class CachedChapterRepository(IChapterRepository repository, ICacheService cacheService) : IChapterRepository {
    public async Task AddAsync(Chapter entity) {
        await repository.AddAsync(entity);
        DeleteCached(string.Format(CacheKey.COURSES_DETAILS, entity.CourseId.Value));
    }

    public async Task DeleteAsync(Chapter entity) {
        await repository.DeleteAsync(entity);
        DeleteCached(string.Format(CacheKey.COURSES_DETAILS, entity.CourseId.Value));
    }

    public async Task DeleteByIdAsync(Guid id) {
        await repository.DeleteByIdAsync(id);
        var chapter = await GetByIdAsync(id);
        if(chapter != null) {
            DeleteCached(string.Format(CacheKey.COURSES_DETAILS, chapter.CourseId.Value));
        }
    }

    public async Task<List<Chapter>> GetAllAsync() {
        return await repository.GetAllAsync();
    }

    public async Task<Chapter?> GetByIdAsync(Guid id) {
        return await repository.GetByIdAsync(id);
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken) {
        return await repository.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Chapter entity) {
        await repository.UpdateAsync(entity);
        DeleteCached(string.Format(CacheKey.COURSES_DETAILS, entity.CourseId.Value));
    }
    private void DeleteCached(string cachedKey) {
        _ = cacheService.DeleteAsync(cachedKey);
    }
}

