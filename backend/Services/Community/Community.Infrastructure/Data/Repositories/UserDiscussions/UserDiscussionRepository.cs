
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

    public async Task<UserDiscussion?> GetByUserIdAnDiscussionId(Guid userId, Guid discussionId)
    {
        var userDiscussion = _dbContext.UserDiscussions
                        .AsEnumerable()
                        .FirstOrDefault(uc => uc.UserId.Value == userId && uc.DiscussionId.Value == discussionId);
        return userDiscussion;
    }

    public async Task<List<Guid>> GetUserIdsWithNotificationsEnabledAsync(Guid discussionId)
    {
        // Tải toàn bộ dữ liệu từ cơ sở dữ liệu
        var userDiscussions = await _dbContext.UserDiscussions
                                              .ToListAsync();

        // Chuyển sang IEnumerable và áp dụng tất cả bộ lọc trong bộ nhớ
        var userIds = userDiscussions
                      .AsEnumerable()
                      .Where(ud => ud.DiscussionId.Value == discussionId && ud.NotificationsEnabled)
                      .Select(ud => ud.UserId.Value)
                      .ToList();

        return userIds;
    }


}
