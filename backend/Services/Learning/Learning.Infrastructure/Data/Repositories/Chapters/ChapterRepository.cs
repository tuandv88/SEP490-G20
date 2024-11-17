
namespace Learning.Infrastructure.Data.Repositories.Chapters;
public class ChapterRepository : Repository<Chapter>, IChapterRepository {
    private readonly IApplicationDbContext _dbContext;
    public ChapterRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext ?? throw new ArgumentNullException();
    }

    public override async Task DeleteByIdAsync(Guid id) {
        var chapter = await GetByIdAsync(id);
        if (chapter != null) {
            _dbContext.Chapters.Remove(chapter);
        }
    }

    public override async Task<Chapter?> GetByIdAsync(Guid id) {
        var chapter = _dbContext.Chapters
                        .AsEnumerable()
                        .FirstOrDefault(c => c.Id.Value == id);
        return chapter;
    }

    public async Task<Chapter?> GetByIdDetailAsync(Guid id) {
        var chapter = _dbContext.Chapters
                        .Include(c => c.Lectures)
                        .AsEnumerable()
                        .FirstOrDefault(c => c.Id.Value == id);
        return chapter;
    }
}

