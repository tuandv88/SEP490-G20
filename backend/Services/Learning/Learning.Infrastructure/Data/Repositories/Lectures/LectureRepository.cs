namespace Learning.Infrastructure.Data.Repositories.Lectures;
public class LectureRepository : Repository<Lecture>, ILectureRepository {
    private readonly IApplicationDbContext _dbContext;
    public LectureRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext ?? throw new ArgumentNullException();
    }

    public override async Task DeleteByIdAsync(Guid id) {
        var lecture = await GetByIdAsync(id);
        if (lecture != null) {
            _dbContext.Lectures.Remove(lecture);
        }
    }

    public override async Task<Lecture?> GetByIdAsync(Guid id) {
        var lecture = _dbContext.Lectures
                        .AsEnumerable()
                        .FirstOrDefault(l => l.Id.Value == id);
        return lecture;
    }

    public async Task<Lecture?> GetLectureByIdDetail(Guid Id) {
        var lecture = _dbContext.Lectures
                        .Include(l => l.Files)
                        .AsNoTracking()
                        .AsEnumerable()
                        .FirstOrDefault(l => l.Id.Value == Id);
        return lecture;
    }
}

