namespace Community.Application.Data.Repositories;

public interface IDiscussionRepository : IRepository<Discussion>
{
    public Task<Discussion?> GetByIdDetailAsync(Guid id);
    public Task<IQueryable<Discussion>?> GetByCategoryIdAsync(Guid id);


}

