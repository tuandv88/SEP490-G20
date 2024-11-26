namespace Learning.Infrastructure.Data.Repositories.UserEnrollments;
public class UserEnrollmentRepository : Repository<UserEnrollment>, IUserEnrollmentRepository
{
    private readonly IApplicationDbContext _dbContext;
    public UserEnrollmentRepository(IApplicationDbContext dbContext) : base(dbContext)
    {
        _dbContext = dbContext;
    }

    public async override Task DeleteByIdAsync(Guid id)
    {
        var userCourse = await GetByIdAsync(id);
        if (userCourse != null)
        {
            _dbContext.UserEnrollments.Remove(userCourse);
        }
    }

    public IQueryable<UserEnrollment> GetAllAsQueryable()
    {
        return _dbContext.UserEnrollments.AsQueryable();
    }

    public async override Task<UserEnrollment?> GetByIdAsync(Guid id)
    {
        var userCourse = await _dbContext.UserEnrollments
                     .FirstOrDefaultAsync(q => q.Id.Equals(UserEnrollmentId.Of(id)));
        return userCourse;
    }

    public async Task<UserEnrollment?> GetByUserIdAndCourseIdAsync(Guid userId, Guid courseId)
    {
        var userCourse = await _dbContext.UserEnrollments
                            .FirstOrDefaultAsync(uc => uc.UserId.Equals(UserId.Of(userId))
                            && uc.CourseId.Equals(CourseId.Of(courseId)));
        return userCourse;
    }

    public async Task<UserEnrollment?> GetByUserIdAndCourseIdWithProgressAsync(Guid userId, Guid courseId)
    {
        var userCourse = await _dbContext.UserEnrollments
                                .Include(u => u.LectureProgress)
                                .FirstOrDefaultAsync(u => u.CourseId.Equals(CourseId.Of(courseId))
                                  && u.UserId.Equals(UserId.Of(userId)));
        return userCourse;
    }
}

