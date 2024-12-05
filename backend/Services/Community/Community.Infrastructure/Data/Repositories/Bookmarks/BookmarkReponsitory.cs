namespace Community.Infrastructure.Data.Repositories.Bookmarks;

public class BookmarkReponsitory : Repository<Bookmark>, IBookmarkRepository
{
    private readonly IApplicationDbContext _dbContext;
    public BookmarkReponsitory(IApplicationDbContext dbContext) : base(dbContext)
    {
        _dbContext = dbContext ?? throw new ArgumentNullException();
    }

    public override async Task<Bookmark?> GetByIdAsync(Guid id)
    {
        var bookmark = _dbContext.Bookmarks
                        .AsEnumerable()
                        .FirstOrDefault(c => c.Id.Value == id);
        return bookmark;
    }

    public override async Task DeleteByIdAsync(Guid id)
    {
        var bookmark = await GetByIdAsync(id);
        if (bookmark != null)
        {
            _dbContext.Bookmarks.Remove(bookmark);
        }
    }

    public async Task<Bookmark?> GetByIdDetailAsync(Guid id)
    {
        return null;
    }

    public async Task<Bookmark?> GetBookmarkDetailByIdIsActiveAsync(Guid id)
    {
        return null;
    }

    public async Task<Bookmark?> GetByIdDiscussionAndUserIdAsync(Guid idDiscussion, Guid idUser)
    {
        var bookmark = _dbContext.Bookmarks
                       .AsEnumerable()
                       .FirstOrDefault(c => c.UserId.Value == idUser && c.DiscussionId.Value == idDiscussion);
        return bookmark;
    }
}
