namespace Community.Application.Data.Repositories;
public interface IUserDiscussionRepository : IRepository<UserDiscussion>
{
    public Task<UserDiscussion?> GetByIdDetailAsync(Guid id);
}
