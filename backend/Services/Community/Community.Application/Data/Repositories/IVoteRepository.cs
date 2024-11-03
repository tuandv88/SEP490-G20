namespace Community.Application.Data.Repositories;

public interface IVoteRepository : IRepository<Vote>
{
    public Task<Vote?> GetByIdDetailAsync(Guid id);
}