
namespace Learning.Application.Data.Repositories;
public interface ICourseRepository : IRepository<Course> {
    Task<Course?> GetByIdDetailAsync(Guid id);
    Task<int> CountByLevelAsync(CourseLevel courseLevel);
    Task<Course?> GetCourseByChapterIdAsync(Guid chapterId);
}

