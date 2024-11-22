namespace Learning.Infrastructure.Data.Repositories.Lectures;
public class LectureRepository : Repository<Lecture>, ILectureRepository {
    private readonly IApplicationDbContext _dbContext;
    public LectureRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext ?? throw new ArgumentNullException();
    }

    public async Task<int> CountByChapterAsync(Guid chapterId) {
        return await _dbContext.Lectures.CountAsync(c => c.ChapterId.Equals(ChapterId.Of(chapterId)));
    }

    public async Task DeleteAsync(params Lecture[] lectures) {
        _dbContext.Lectures.RemoveRange(lectures);
    }

    public override async Task DeleteByIdAsync(Guid id) {
        var lecture = await GetByIdAsync(id);
        if (lecture != null) {
            _dbContext.Lectures.Remove(lecture);
        }
    }

    public override async Task<Lecture?> GetByIdAsync(Guid id) {
        var lecture = await _dbContext.Lectures
                        .FirstOrDefaultAsync(l => l.Id.Equals(LectureId.Of(id)));
        return lecture;
    }

    public async Task<Lecture?> GetByQuizIdAsync(Guid quizId) {
        var lecture = await _dbContext.Lectures
                            .FirstOrDefaultAsync(l => l.QuizId != null && l.QuizId.Equals(QuizId.Of(quizId)));
        return lecture;
    }

    public async Task<Lecture?> GetLectureByIdDetail(Guid Id) {
        var lecture = await _dbContext.Lectures
                        .Include(l => l.Files)
                        .FirstOrDefaultAsync(l => l.Id.Equals(LectureId.Of(Id)));

        return lecture;
    }
}

