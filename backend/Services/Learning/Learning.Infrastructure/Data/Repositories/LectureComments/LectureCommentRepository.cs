

using BuildingBlocks.CQRS;

namespace Learning.Infrastructure.Data.Repositories.LectureComments;
public class LectureCommentRepository : Repository<LectureComment>, ILectureCommentRepository {
    private readonly IApplicationDbContext _dbContext;
    public LectureCommentRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext;
    }

    public async override Task DeleteByIdAsync(Guid id) {
        var lectureComment = await GetByIdAsync(id);
        if (lectureComment != null) {
            _dbContext.LectureComments.Remove(lectureComment);
        }
    }

    public IQueryable<LectureComment> GetAllAsQueryable() {
        return _dbContext.LectureComments.AsQueryable();
    }

    public async override Task<LectureComment?> GetByIdAsync(Guid id) {
        var lectureComment = await _dbContext.LectureComments
                        .FirstOrDefaultAsync(q => q.Id.Equals(LectureCommentId.Of(id)));
        return lectureComment;
    }

    public async Task<LectureComment?> GetByUserIdAsync(Guid userId, Guid lectureCommentId) {
        var lectureComment = await _dbContext.LectureComments
                        .FirstOrDefaultAsync(q => q.Id.Equals(LectureCommentId.Of(lectureCommentId)) && q.UserId.Equals(UserId.Of(userId)));
        return lectureComment;
    }
}

