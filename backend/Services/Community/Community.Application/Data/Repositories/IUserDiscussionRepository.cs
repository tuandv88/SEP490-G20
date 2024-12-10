namespace Community.Application.Data.Repositories;
public interface IUserDiscussionRepository : IRepository<UserDiscussion>
{
    public Task<UserDiscussion?> GetByIdDetailAsync(Guid id);
    public Task<UserDiscussion?> GetByUserIdAnDiscussionId(Guid userId, Guid discussionId);
}
