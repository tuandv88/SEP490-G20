
namespace Learning.Application.Data.Repositories;
public interface ITestScriptRepository : IRepository<TestScript> {
    Task<List<TestScript>> GetByProblemIdAsync(ProblemId id);
}

