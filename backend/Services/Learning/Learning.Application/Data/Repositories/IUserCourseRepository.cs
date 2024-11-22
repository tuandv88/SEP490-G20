namespace Learning.Application.Data.Repositories;
public interface IUserCourseRepository : IRepository<UserCourse> {
    Task<UserCourse?> GetByUserIdAndCourseIdAsync(Guid userId, Guid courseId);
    IQueryable<UserCourse> GetAllAsQueryable();
    Task<UserCourse?> GetByUserIdAndCourseIdWithProgressAsync(Guid userId, Guid courseId);
}

