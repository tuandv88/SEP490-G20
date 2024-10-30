namespace Community.Infrastructure.Data.Repositories.Discussions;
public class DiscussionRepository : Repository<Discussion>, IDiscussionRepository
{
    private readonly IApplicationDbContext _dbContext;
    public DiscussionRepository(IApplicationDbContext dbContext) : base(dbContext)
    {
        _dbContext = dbContext ?? throw new ArgumentNullException();
    }

    public override async Task DeleteByIdAsync(Guid id)
    {
        var discussion = await GetByIdAsync(id);
        if (discussion != null)
        {
            _dbContext.Discussions.Remove(discussion);
        }
    }

    public override async Task<Discussion?> GetByIdAsync(Guid id)
    {
        var discussion = _dbContext.Discussions
                        .AsEnumerable()
                        .FirstOrDefault(c => c.Id.Value == id);
        return discussion;
    }

    public async Task<Discussion?> GetByIdDetailAsync(Guid id)
    {
        return null;
    }
}





