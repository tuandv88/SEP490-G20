using Microsoft.EntityFrameworkCore;

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
        var problemSubmission =  _dbContext.ProblemSubmissions
                                    .AsEnumerable()
                                    .FirstOrDefault(p => p.Id.Value == id);
        return problemSubmission;
    }

    public async Task<List<ProblemSubmission>> GetProblemSubmissionsByProblemAsync(params Guid[] problems) {
        var problemSubmissions = _dbContext.ProblemSubmissions
                                .AsEnumerable()
                                .Where(ps => problems.Contains(ps.ProblemId.Value))
                                .ToList();
        return problemSubmissions;
    }
}

