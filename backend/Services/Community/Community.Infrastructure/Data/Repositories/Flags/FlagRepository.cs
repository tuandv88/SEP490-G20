

namespace Community.Infrastructure.Data.Repositories.Flags;
public class FlagRepository : Repository<Flag>, IFlagRepository {
    private readonly IApplicationDbContext _dbContext;
    public FlagRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext;
    }

    public async override Task DeleteByIdAsync(Guid id) {
        var flag = await GetByIdAsync(id);
        if (flag != null) {
            _dbContext.Flags.Remove(flag);
        }
    }

    public async override Task<Flag?> GetByIdAsync(Guid id) {
        var flags = await _dbContext.Flags
                        .FirstOrDefaultAsync(c => c.Id.Equals(FlagId.Of(id)));
        return flags;
    }
}

