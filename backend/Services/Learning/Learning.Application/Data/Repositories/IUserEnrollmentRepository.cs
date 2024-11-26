namespace Learning.Application.Data.Repositories;
public interface IUserEnrollmentRepository : IRepository<UserEnrollment> {
    Task<UserEnrollment?> GetByUserIdAndCourseIdAsync(Guid userId, Guid courseId);
    IQueryable<UserEnrollment> GetAllAsQueryable();
    Task<UserEnrollment?> GetByUserIdAndCourseIdWithProgressAsync(Guid userId, Guid courseId);
}

