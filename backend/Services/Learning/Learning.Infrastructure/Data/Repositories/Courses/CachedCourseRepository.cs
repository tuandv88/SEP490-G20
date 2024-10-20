namespace Learning.Infrastructure.Data.Repositories.Courses;
public class CachedCourseRepository(ICourseRepository repository, ICacheService cacheService) : ICourseRepository {
    public async Task AddAsync(Course entity) {
        await repository.AddAsync(entity);
    }

    public async Task DeleteAsync(Course entity) {
        await repository.DeleteAsync(entity);
    }

    public async Task DeleteByIdAsync(Guid id) {
        await repository.DeleteByIdAsync(id);
    }

    public async Task<List<Course>> GetAllAsync() {
        //Dùng cache
        var cachedKey = CacheKey.COURSES;
        var allData = await cacheService.GetAsync<List<Course>>(cachedKey);

        if (allData == null || !allData.Any()) {
            allData = await repository.GetAllAsync();
            _ = cacheService.SetAsync(cachedKey, allData);
        }

        return allData;
    }

    public async Task<Course?> GetByIdAsync(Guid id) {
        var allData = await GetAllAsync();
        var course = allData.Where(c => c.Id.Value == id).FirstOrDefault();
        return course;
    }

    public async Task<Course?> GetByIdDetailAsync(Guid id) {
        return await repository.GetByIdDetailAsync(id);
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken) {
        int n = await repository.SaveChangesAsync(cancellationToken);
        //Xóa cached
        var cachedKey = CacheKey.COURSES;
        _ = cacheService.DeleteAsync(cachedKey);
        return n;
    }

    public async Task UpdateAsync(Course entity) {
        await repository.UpdateAsync(entity);
    }
}

