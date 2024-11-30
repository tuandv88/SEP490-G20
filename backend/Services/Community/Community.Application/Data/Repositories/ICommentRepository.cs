namespace Community.Application.Data.Repositories;

public interface ICommentRepository : IRepository<Comment>
{
    public Task<Comment?> GetByIdDetailAsync(Guid id);
    public Task<List<Comment>?> GetAllCommentDetailsAsync();
    public Task<List<Comment>?> GetAllCommentsByIdDiscussionAsync(Guid id);
    public Task<List<Comment>?> GetAllCommentsByIdCommentParentAsync(Guid idCommentDiscusison, Guid idCommentParent);
}