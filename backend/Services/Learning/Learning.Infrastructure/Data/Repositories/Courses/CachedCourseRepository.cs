
namespace Learning.Infrastructure.Data.Repositories.Courses;
public class CachedCourseRepository(ICourseRepository repository, ICacheService cacheService) : ICourseRepository {
    public async Task AddAsync(Course entity) {
        await repository.AddAsync(entity);
        //Xóa cached
        DeleteCached(CacheKey.COURSES);
    }

    public async Task<int> CountByLevelAsync(CourseLevel courseLevel) {
        return await repository.CountByLevelAsync(courseLevel);
    }

    public async Task DeleteAsync(Course entity) {
        await repository.DeleteAsync(entity);
        //Xóa cached
        DeleteCached(CacheKey.COURSES);
        DeleteCached(string.Format(CacheKey.COURSES_DETAILS, entity.Id.Value));
    }

    public async Task DeleteByIdAsync(Guid id) {
        await repository.DeleteByIdAsync(id);
        //Xóa cached
        DeleteCached(CacheKey.COURSES);
        DeleteCached(string.Format(CacheKey.COURSES_DETAILS, id));
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
        //TODO
        var cachedKey = string.Format(CacheKey.COURSES_DETAILS, id);
        var allData = await cacheService.GetAsync<Course>(cachedKey);

        if (allData == null ) {
            allData = await repository.GetByIdDetailAsync(id);
            _ = cacheService.SetAsync(cachedKey, allData);
        }
        return allData;
    }

    public async Task<Course?> GetCourseByChapterIdAsync(Guid chapterId) {
        return await repository.GetCourseByChapterIdAsync(chapterId);
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken) {
        int n = await repository.SaveChangesAsync(cancellationToken);
        return n;
    }

    public async Task UpdateAsync(Course entity) {
        await repository.UpdateAsync(entity);
        //Xóa cached
        DeleteCached(CacheKey.COURSES);
        DeleteCached(string.Format(CacheKey.COURSES_DETAILS, entity.Id.Value));
    }
    private void DeleteCached(string cachedKey) {
        _ = cacheService.DeleteAsync(cachedKey);
    }
}

