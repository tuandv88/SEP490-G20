

namespace Learning.Infrastructure.Data.Repositories.TestCases;
public class TestCaseRepository : Repository<TestCase>, ITestCaseRepository {
    private IApplicationDbContext _dbContext;
    public TestCaseRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext;
    }

    public override async Task DeleteByIdAsync(Guid id) {
        var testCase = await GetByIdAsync(id);
        if (testCase != null) {
            _dbContext.TestCases.Remove(testCase);
        }
    }

    public override async Task<TestCase?> GetByIdAsync(Guid id) {
        var testCase = _dbContext.TestCases
                        .FirstOrDefault(c => c.Id.Equals(TestCaseId.Of(id)));
        return testCase;
    }
}

