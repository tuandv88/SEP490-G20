namespace Learning.Application.Data.Repositories;
public interface IChapterRepository : IRepository<Chapter>{
    Task<Chapter?> GetByIdDetailAsync(Guid id);
    Task<int> CountByCourseAsync(Guid courseId);
    Task DeleteAsync(Chapter[] chapters);
}

