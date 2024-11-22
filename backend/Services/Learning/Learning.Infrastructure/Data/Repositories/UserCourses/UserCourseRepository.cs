namespace Learning.Infrastructure.Data.Repositories.UserCourses;
public class UserCourseRepository : Repository<UserCourse>, IUserCourseRepository {
    private readonly IApplicationDbContext _dbContext;
    public UserCourseRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext;
    }

    public async override Task DeleteByIdAsync(Guid id) {
        var userCourse = await GetByIdAsync(id);
        if (userCourse != null) {
            _dbContext.UserCourses.Remove(userCourse);
        }
    }

    public IQueryable<UserCourse> GetAllAsQueryable() {
        return _dbContext.UserCourses.AsQueryable();
    }

    public async override Task<UserCourse?> GetByIdAsync(Guid id) {
        var userCourse = await _dbContext.UserCourses
                     .FirstOrDefaultAsync(q => q.Id.Equals(UserCourseId.Of(id)));
        return userCourse;
    }

    public async Task<UserCourse?> GetByUserIdAndCourseIdAsync(Guid userId, Guid courseId) {
        var userCourse = await _dbContext.UserCourses
                            .FirstOrDefaultAsync(uc => uc.UserId.Equals(UserId.Of(userId)) 
                            && uc.CourseId.Equals(CourseId.Of(courseId)));
        return userCourse;
    }

    public async Task<UserCourse?> GetByUserIdAndCourseIdWithProgressAsync(Guid userId, Guid courseId) {
        var userCourse = await _dbContext.UserCourses
                                .Include(u => u.LectureProgress)
                                .FirstOrDefaultAsync(u => u.CourseId.Equals(CourseId.Of(courseId))
                                  && u.UserId.Equals(UserId.Of(userId)));
        return userCourse;
    }
}

