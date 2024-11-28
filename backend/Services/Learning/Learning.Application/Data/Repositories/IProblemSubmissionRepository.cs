
namespace Learning.Application.Data.Repositories;
public interface IProblemSubmissionRepository : IRepository<ProblemSubmission> {
    Task<List<ProblemSubmission>> GetByProblemIdAndUserIdAsync(Guid problemId, Guid userId);
    IQueryable<ProblemSubmission> GetAllAsQueryAble();
}

