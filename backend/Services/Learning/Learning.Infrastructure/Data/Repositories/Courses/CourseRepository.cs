


namespace Learning.Infrastructure.Data.Repositories.Courses;
public class CourseRepository : Repository<Course>, ICourseRepository {
    private readonly IApplicationDbContext _dbContext;
    public CourseRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext ?? throw new ArgumentNullException();
    }

    public async Task<int> CountByLevelAsync(CourseLevel courseLevel) {
        var number = await _dbContext.Courses.CountAsync(c => c.CourseLevel == courseLevel);
        return number;
    }

    public override async Task DeleteByIdAsync(Guid id) {
        var course = await GetByIdAsync(id);
        if (course != null) {
            _dbContext.Courses.Remove(course);
        }
    }

    public IQueryable<Course> GetAllAsQueryable() {
        return _dbContext.Courses.AsQueryable();
    }

    public async Task<List<Course>> GetByCourseLevelAsync(CourseLevel courseLevel) {
        var courses = await _dbContext.Courses
            .Where(c => c.CourseLevel == courseLevel)
            .OrderBy(c => c.OrderIndex)
            .ToListAsync();
        return courses;
    }

    public override async Task<Course?> GetByIdAsync(Guid id) {
        var course = await _dbContext.Courses
                        .FirstOrDefaultAsync(c => c.Id.Equals(CourseId.Of(id)));
        return course;
    }

    public async Task<Course?> GetByIdDetailAsync(Guid id) {
        var course = await _dbContext.Courses
            .Include(c => c.Chapters)
            .ThenInclude(c => c.Lectures)
            //.AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id.Equals(CourseId.Of(id)));
        return course;
    }


    public async Task<Course?> GetCourseByChapterIdAsync(Guid chapterId) {
        var course = await _dbContext.Courses
            .Include(c => c.Chapters)
            .FirstOrDefaultAsync(c => c.Chapters.Any(ch => ch.Id.Equals(ChapterId.Of(chapterId))));
        return course;
    }

    public void Update(params Course[] courses) {
        _dbContext.Courses.UpdateRange(courses);
    }
}

