namespace Learning.Application.Data.Repositories;
public interface IChapterRepository : IRepository<Chapter>{
    public Task<Chapter?> GetByIdDetailAsync(Guid id);
}

