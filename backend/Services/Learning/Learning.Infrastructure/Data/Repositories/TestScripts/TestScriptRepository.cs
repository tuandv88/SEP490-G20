

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
        var testScript = await _dbContext.TestScripts
                         .FirstOrDefaultAsync(c => c.Id.Equals(TestScriptId.Of(id)));
        return testScript;
    }
}

