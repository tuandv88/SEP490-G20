namespace Community.Application.Data.Repositories;

public interface IDiscussionRepository : IRepository<Discussion>
{
    public Task<List<Discussion>?> GetAllDetailIAsync();
    public Task<Discussion?> GetByIdDetailAsync(Guid id);
    public Task<IQueryable<Discussion>?> GetByCategoryIdAsync(Guid id);
    public Task<IQueryable<Discussion>?> GetByCategoryIdIsActiveAsync(Guid id);
    public Task<IQueryable<Discussion>?> GetAllDiscussionByUserIdAsync(Guid userId);
    public Task<IQueryable<Discussion>?> GetDiscussionsAll();
}

