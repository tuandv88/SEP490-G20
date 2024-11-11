namespace Community.Infrastructure.Data.Repositories.UserDiscussions;

public class UserDiscussionRepository : Repository<UserDiscussion>, IUserDiscussionRepository
{
    private readonly IApplicationDbContext _dbContext;
    public UserDiscussionRepository(IApplicationDbContext dbContext) : base(dbContext)
    {
        _dbContext = dbContext ?? throw new ArgumentNullException();
    }

    public override async Task DeleteByIdAsync(Guid id)
    {
        var userDiscussion = await GetByIdAsync(id);
        if (userDiscussion != null)
        {
            _dbContext.UserDiscussions.Remove(userDiscussion);
        }
    }

    public override async Task<UserDiscussion?> GetByIdAsync(Guid id)
    {
        var userDiscussion = _dbContext.UserDiscussions
                        .AsEnumerable()
                        .FirstOrDefault(c => c.Id.Value == id);
        return userDiscussion;
    }

    public async Task<UserDiscussion?> GetByIdDetailAsync(Guid id)
    {
        return null;
    }

}
