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


    public async override Task<ProblemSubmission?> GetByIdAsync(Guid id) {
        var problemSubmission = await  _dbContext.ProblemSubmissions
                                    .FirstOrDefaultAsync(p => p.Id.Equals(ProblemSolutionId.Of(id)));
        return problemSubmission;
    }
}

