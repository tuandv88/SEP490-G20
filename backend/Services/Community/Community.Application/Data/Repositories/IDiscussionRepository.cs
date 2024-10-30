namespace Community.Application.Data.Repositories;

public interface IDiscussionRepository : IRepository<Discussion>
{
    public Task<Discussion?> GetByIdDetailAsync(Guid id);
}

