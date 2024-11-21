namespace Community.Application.Data.Repositories;

public interface IVoteRepository : IRepository<Vote>
{
    public Task<Vote?> GetByIdDetailAsync(Guid id);
    Task<IQueryable<Vote>> GetVotesByCommentIdAsync(Guid commentId);
    public Task<List<Vote>?> GetAllVotesByIdDiscussionAsync(Guid id);
    public Task<List<Vote>?> GetAllVotesByIdCommentAsync(Guid id);
}