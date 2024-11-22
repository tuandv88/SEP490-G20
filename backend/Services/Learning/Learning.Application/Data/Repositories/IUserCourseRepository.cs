namespace Learning.Application.Data.Repositories;
public interface IUserCourseRepository : IRepository<UserCourse> {
    Task<UserCourse?> GetByUserIdAndCourseId(Guid userId, Guid courseId);
}

