
namespace Learning.Infrastructure.Data.Repositories.Problems;
public class ProblemRepository : Repository<Problem>, IProblemRepository {
    private IApplicationDbContext _dbContext;
    public ProblemRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext;
    }

    public override async Task DeleteByIdAsync(Guid id) {
        var problem = await GetByIdAsync(id);
        if (problem != null) {
            _dbContext.Problems.Remove(problem);
        }
    }

    public override async Task<Problem?> GetByIdAsync(Guid id) {
        var problem = _dbContext.Problems
                        .AsEnumerable()
                        .FirstOrDefault(c => c.Id.Value == id);
        return problem;
    }

    public async Task<Problem?> GetByIdDetailAsync(Guid id) {
        var problem = _dbContext.Problems
                        .Include(p => p.TestScripts)
                        .Include(p => p.ProblemSolutions)
                        .Include(p => p.TestCases)
                        .AsNoTracking()
                        .AsEnumerable()
                        .FirstOrDefault(p => p.Id.Value == id);
        return problem;
    }

}

