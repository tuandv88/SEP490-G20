using BuildingBlocks.CQRS;
using System.Linq;

namespace Learning.Infrastructure.Data.Repositories.ProblemSubmissions;
public class ProblemSubmissionRepository : Repository<ProblemSubmission>, IProblemSubmissionRepository {
    private readonly IApplicationDbContext _dbContext;
    public ProblemSubmissionRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext;
    }

    public async override Task DeleteByIdAsync(Guid id) {
        var problemSubmission = await GetByIdAsync(id);
        if (problemSubmission != null) {
            _dbContext.ProblemSubmissions.Remove(problemSubmission);
        }
    }

    public IQueryable<ProblemSubmission> GetAllAsQueryAble() {
        return _dbContext.ProblemSubmissions.AsQueryable();
    }

    public async override Task<ProblemSubmission?> GetByIdAsync(Guid id) {
        var problemSubmission = await  _dbContext.ProblemSubmissions
                                    .FirstOrDefaultAsync(p => p.Id.Equals(ProblemSolutionId.Of(id)));
        return problemSubmission;
    }

    public async Task<List<ProblemSubmission>> GetByProblemIdAndUserIdAsync(Guid problemId, Guid userId) {
         var submissions = await _dbContext.ProblemSubmissions
                                    .Where(p => p.ProblemId.Equals(ProblemId.Of(problemId)) && p.UserId.Equals(UserId.Of(userId)))
                                    .ToListAsync();
        return submissions;
    }
}

