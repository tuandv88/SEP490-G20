

namespace Learning.Application.Data.Repositories;
public interface ILectureCommentRepository : IRepository<LectureComment> {
    IQueryable<LectureComment> GetAllAsQueryable();
    Task<LectureComment?> GetByUserIdAsync(Guid userId, Guid lectureCommentId);
}

