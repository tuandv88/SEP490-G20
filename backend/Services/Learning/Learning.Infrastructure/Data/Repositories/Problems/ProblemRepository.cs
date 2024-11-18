
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
        var problem =await _dbContext.Problems
                        .FirstOrDefaultAsync(c => c.Id.Equals(ProblemId.Of(id)));
        return problem;
    }

    public async Task<Problem?> GetByIdDetailAsync(Guid id) {
        var problem = await _dbContext.Problems
                        .Include(p => p.TestScripts)
                        .Include(p => p.ProblemSolutions)
                        .Include(p => p.TestCases)
                        .AsNoTracking()
                        .FirstOrDefaultAsync(p => p.Id.Equals(ProblemId.Of(id)));
        return problem;
    }

}

