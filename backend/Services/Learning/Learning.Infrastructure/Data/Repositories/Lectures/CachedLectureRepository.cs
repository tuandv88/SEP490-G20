namespace Learning.Infrastructure.Data.Repositories.Lectures;
public class CachedLectureRepository(ILectureRepository lectureRepository, IChapterRepository chapterRepository, ICacheService cacheService) : ILectureRepository {
    public async Task AddAsync(Lecture entity) {
        await lectureRepository.AddAsync(entity);
        await RemoveCachedCourseDetails(entity);
    }

    public async Task<int> CountByChapterAsync(Guid chapterId) {
         return await lectureRepository.CountByChapterAsync(chapterId);
    }

    public async Task DeleteAsync(Lecture entity) {
        await lectureRepository.DeleteAsync(entity);
        await RemoveCachedCourseDetails(entity);
    }

    public async Task DeleteByIdAsync(Guid id) {
        await lectureRepository.DeleteByIdAsync(id);
        var lecture = await GetByIdAsync(id);
        await RemoveCachedCourseDetails(lecture);
    }

    public async Task<List<Lecture>> GetAllAsync() {
        return await lectureRepository.GetAllAsync();
    }

    public async Task<Lecture?> GetByIdAsync(Guid id) {
        return await lectureRepository.GetByIdAsync(id);
    }

    public async Task<Lecture?> GetLectureByIdDetail(Guid Id) {
        return await lectureRepository.GetLectureByIdDetail(Id);
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken) {
        return await lectureRepository.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Lecture entity) {
        await lectureRepository.UpdateAsync(entity);
        await RemoveCachedCourseDetails(entity);
    }

    private void DeleteCached(string cachedKey) {
        _ = cacheService.DeleteAsync(cachedKey);
    }
    private async Task RemoveCachedCourseDetails(Lecture? lecture) {
        if (lecture != null) {
            var chapters = await chapterRepository.GetAllAsync();
            var chapter = chapters.Where(c => c.Id.Value == lecture.ChapterId.Value).FirstOrDefault();
            if (chapter != null) {
                string cachedKey = string.Format(CacheKey.COURSES_DETAILS, chapter.CourseId.Value);
                DeleteCached(cachedKey);
            }
        }
    }
}

