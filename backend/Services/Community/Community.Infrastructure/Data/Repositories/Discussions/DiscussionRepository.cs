

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
                        .AsNoTracking()
                        .Include(d => d.Bookmarks)
                        .Include(d => d.Comments)
                        .Include(d => d.Votes)
                        .AsEnumerable()
                        .FirstOrDefault(c => c.Id.Value == id);
        return discussion;
    }

    public async Task<Discussion?> GetByIdDetailAsync(Guid id)
    {
        var discussion = _dbContext.Discussions
                       .Include(d => d.UserDiscussions)
                       .Include(d => d.Comments)
                       .ThenInclude(c => c.Votes)
                       .Include(d => d.Votes)
                       .Include(d => d.Bookmarks)
                       .AsEnumerable()
                       .FirstOrDefault(c => c.Id.Value == id);
        return discussion;
    }

    public async Task<IQueryable<Discussion>> GetByCategoryIdAsync(Guid id)
    {
        var discussions = _dbContext.Discussions
            .Include(d => d.Votes)
            .Include(d => d.Comments)
            .AsEnumerable()  // Chuyển truy vấn sang client-side để xử lý
            .Where(d => d.CategoryId.Value == id)  // So sánh trực tiếp với giá trị `Guid`
            .AsQueryable();

        return await Task.FromResult(discussions);
    }

    public async Task<IQueryable<Discussion>> GetByCategoryIdIsActiveAsync(Guid id)
    {
        // Lấy tất cả các bản ghi có IsActive = true từ database
        var discussions = _dbContext.Discussions
            .Include(d => d.Votes)
            .Include(d => d.Comments)
            .AsEnumerable()  // Chuyển truy vấn sang client-side để xử lý
            .Where(d => d.CategoryId.Value == id && d.IsActive) // Điều kiện này được thực thi trên client-side
            .AsQueryable();

        return await Task.FromResult(discussions);
    }

    public async Task<List<Discussion>?> GetAllDetailIAsync()
    {
        var discussion = _dbContext.Discussions
                       .AsNoTracking()
                       .Include(d => d.Comments)
                       .Include(d => d.Votes)
                       .AsEnumerable()
                       .ToList();
        return discussion;
    }
}





