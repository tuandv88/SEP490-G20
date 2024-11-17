
namespace Learning.Infrastructure.Data.Repositories.ProblemSolutions;

public class ProblemSolutionRepository : Repository<ProblemSolution>, IProblemSolutionRepository {
    private IApplicationDbContext _dbContext;
    public ProblemSolutionRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext;
    }

    public override async Task DeleteByIdAsync(Guid id) {
        var problemSolution = await GetByIdAsync(id);
        if (problemSolution != null) {
            _dbContext.ProblemSolutions.Remove(problemSolution); 
        }
    }

    public override async Task<ProblemSolution?> GetByIdAsync(Guid id) {
        var problemSolution =await _dbContext.ProblemSolutions
                            .FirstOrDefaultAsync(p => p.Id.Equals(ProblemSolutionId.Of(id)));
        return problemSolution;
    }
}

