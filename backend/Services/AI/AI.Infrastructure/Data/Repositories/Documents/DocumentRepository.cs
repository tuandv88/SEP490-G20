using AI.Application.Data;

namespace AI.Infrastructure.Data.Repositories.Documents;
public class DocumentRepository : Repository<Document>, IDocumentRepository {
    private IApplicationDbContext _dbContext;
    public DocumentRepository(IApplicationDbContext dbContext) : base(dbContext) {
        _dbContext = dbContext;
    }

    public async override Task DeleteByIdAsync(Guid id) {
        var document = await GetByIdAsync(id);
        if (document != null) {
            _dbContext.Documents.Remove(document);
        }
    }

    public async override Task<Document?> GetByIdAsync(Guid id) {
        var document = _dbContext.Documents
                       .AsEnumerable()
                       .FirstOrDefault(c => c.Id.Value == id);
        return document;
    }

    public async Task<List<Document>> GetDocuments(params Guid[] documentIds) {
        return await _dbContext.Documents
            .AsAsyncEnumerable()
            .Where(doc => documentIds.Contains(doc.Id.Value))
            .ToListAsync();
    }
}

