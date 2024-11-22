

namespace Learning.Infrastructure.Data.Repositories.LectureProgresses;
public class LectureProgressRepository : Repository<LectureProgress>, ILectureProgressRepository {
    private readonly IApplicationDbContext _dbContext;
    public LectureProgressRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext;
    }

    public async override Task DeleteByIdAsync(Guid id) {
        var progress = await GetByIdAsync(id);
        if (progress != null) {
            _dbContext.LecturesProgress.Remove(progress);
        }
    }

    public async override Task<LectureProgress?> GetByIdAsync(Guid id) {
        var progress = await _dbContext.LecturesProgress
                        .FirstOrDefaultAsync(q => q.Id.Equals(LectureProgressId.Of(id)));
        return progress;
    }
}

