namespace Learning.Infrastructure.Data.Repositories.Courses;
public class CourseRepository : Repository<Course>, ICourseRepository {
    private readonly IApplicationDbContext _dbContext;
    public CourseRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext ?? throw new ArgumentNullException();
    }

    public override async Task DeleteByIdAsync(Guid id) {
        var course = await GetByIdAsync(id);
        if (course != null) {
            _dbContext.Courses.Remove(course);
        }
    }

    public override async Task<Course?> GetByIdAsync(Guid id) {
        var course = _dbContext.Courses
                        .AsEnumerable()
                        .FirstOrDefault(c => c.Id.Value == id);
        return course;
    }
}

