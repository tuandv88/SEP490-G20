
namespace Learning.Application.Data.Repositories;
public interface ICourseRepository : IRepository<Course> {
    Task<Course?> GetByIdDetailAsync(Guid id);
    Task<int> CountByLevelAsync(CourseLevel courseLevel);
    Task<Course?> GetCourseByChapterIdAsync(Guid chapterId);
    Task<List<Course>> GetByCourseLevelAsync(CourseLevel courseLevel);
    void Update(params Course[] courses);
    IQueryable<Course> GetAllAsQueryable();
}

