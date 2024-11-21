
namespace Learning.Application.Data.Repositories;
public interface ITestCaseRepository : IRepository<TestCase> {
    Task<List<TestCase>> GetByProblemIdAsync(ProblemId id);
}

