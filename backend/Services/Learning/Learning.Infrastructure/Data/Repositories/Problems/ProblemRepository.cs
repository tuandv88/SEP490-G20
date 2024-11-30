using Learning.Application.Commons;
using Learning.Application.Models.Problems.Dtos;


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

    public IQueryable<Problem> GetAllAsQueryable() {
        var problems = _dbContext.Problems.AsQueryable();
        return problems;
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
                        .FirstOrDefaultAsync(p => p.Id.Equals(ProblemId.Of(id)));
        return problem;
    }

    public async Task<Dictionary<DifficultyType, int>> GetSolvedProblemsByUserAsync(Guid userId) {
        var problemSubmissions = await _dbContext.ProblemSubmissions
            .Where(ps => ps.UserId.Equals(UserId.Of(userId)))
            .Join(_dbContext.Problems,
                ps => ps.ProblemId,
                p => p.Id,
                (ps, p) => new { ps, p.DifficultyType, p.ProblemType })
            .Where(x => x.ProblemType == ProblemType.Challenge)
            .ToListAsync();

        var filteredData = problemSubmissions
            .Where(x => x.ps.Status.Description == SubmissionConstant.Accepted)
            .GroupBy(x => x.DifficultyType)
            .ToDictionary(g => g.Key, g => g.Count());

        return filteredData;
    }


    public async Task<Dictionary<DifficultyType, int>> GetTotalProblemsByDifficultyAsync() {
        return await _dbContext.Problems
            .Where(p => p.ProblemType == ProblemType.Challenge)
            .GroupBy(p => p.DifficultyType)
            .ToDictionaryAsync(g => g.Key, g => g.Count());
    }
}

