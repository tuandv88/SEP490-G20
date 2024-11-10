namespace Community.Application.Data.Repositories;

public interface IBookmarkRepository : IRepository<Bookmark>
{
    public Task<Bookmark?> GetByIdDetailAsync(Guid id);
    public Task<Bookmark?> GetBookmarkDetailByIdIsActiveAsync(Guid id);
}
