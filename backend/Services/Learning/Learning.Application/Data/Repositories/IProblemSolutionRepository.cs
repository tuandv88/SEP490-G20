
namespace Learning.Application.Data.Repositories;
public interface IProblemSolutionRepository : IRepository<ProblemSolution> {
    Task<List<ProblemSolution>> GetByProblemIdAsync(ProblemId id);
}

