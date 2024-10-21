

namespace Learning.Infrastructure.Data.Repositories.Files;
public class FileRepository : Repository<Domain.Models.File>, IFileRepository {
    private IApplicationDbContext _dbContext;
    public FileRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext;
    }

    public override async Task DeleteByIdAsync(Guid id) {
        var file = await GetByIdAsync(id);
        if (file != null) { 
            _dbContext.Files.Remove(file);
        }
    }

    public override async Task<Domain.Models.File?> GetByIdAsync(Guid id) {
        var file = _dbContext.Files
                        .AsEnumerable()
                        .FirstOrDefault(c => c.Id.Value == id);
        return file;
    }
}

