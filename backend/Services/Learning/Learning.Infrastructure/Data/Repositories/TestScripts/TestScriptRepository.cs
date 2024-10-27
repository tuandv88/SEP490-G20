

namespace Learning.Infrastructure.Data.Repositories.TestScripts;
public class TestScriptRepository : Repository<TestScript>, ITestScriptRepository {
    private IApplicationDbContext _dbContext;
    public TestScriptRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext;
    }

    public override async Task DeleteByIdAsync(Guid id) {
        var testScript = await GetByIdAsync(id);
        if (testScript != null) {
            _dbContext.TestScripts.Remove(testScript);
        }
    }

    public override async Task<TestScript?> GetByIdAsync(Guid id) {
        var testScript = _dbContext.TestScripts
                         .AsEnumerable()
                         .FirstOrDefault(c => c.Id.Value == id);
        return testScript;
    }
}

