
namespace Learning.Infrastructure.Data.Repositories.Chapters;
public class ChapterRepository : Repository<Chapter>, IChapterRepository {
    private readonly IApplicationDbContext _dbContext;
    public ChapterRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext ?? throw new ArgumentNullException();
    }

    public async Task<int> CountByCourseAsync(Guid courseId) {
        return await _dbContext.Chapters.CountAsync(c => c.CourseId.Equals(CourseId.Of(courseId)));
    }

    public async Task DeleteAsync(Chapter[] chapters) {
        _dbContext.Chapters.RemoveRange(chapters);
    }

    public override async Task DeleteByIdAsync(Guid id) {
        var chapter = await GetByIdAsync(id);
        if (chapter != null) {
            _dbContext.Chapters.Remove(chapter);
        }
    }

    public override async Task<Chapter?> GetByIdAsync(Guid id) {
        var chapter = await _dbContext.Chapters
                        .FirstOrDefaultAsync(c => c.Id.Equals(ChapterId.Of(id)));
        return chapter;
    }

    public async Task<Chapter?> GetByIdDetailAsync(Guid id) {
        var chapter = await _dbContext.Chapters
            .Include(c => c.Lectures)
            .FirstOrDefaultAsync(c => c.Id.Equals(ChapterId.Of(id)));
        return chapter;
    }
}

