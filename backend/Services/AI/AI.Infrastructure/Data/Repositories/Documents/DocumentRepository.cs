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

    public async Task DeleteDocumentsByTagAsync(string tagName, string tagValue) {
        var documents = await _dbContext.Documents.ToListAsync();
        if (documents.Any()) {
            _dbContext.Documents.RemoveRange(
                documents.Where(d => d.Tags.ContainsKey(tagName) && 
                (string)d.Tags[tagName] == tagValue).ToList()
                );
        }
    }

    public async override Task<Document?> GetByIdAsync(Guid id) {
        var document = await _dbContext.Documents
                       .FirstOrDefaultAsync(c => c.Id.Equals(DocumentId.Of(id)));
        return document;
    }

    public async Task<List<Guid>> GetDocumentIdsByTagAsync(string tagName, string tagValue) {
        var documents = await _dbContext.Documents.ToListAsync();
        return documents
            .Where(d => d.Tags.ContainsKey(tagName) && d.Tags[tagName].ToString() == tagValue)
            .Select(d => d.Id.Value)
            .ToList();
    }


    public async Task<List<Document>?> GetDocumentsAsync(params DocumentId[] documentIds) {
        var documents = await _dbContext.Documents
            .Where(doc => documentIds.Contains(doc.Id))
            .ToListAsync();
        return documents;
    }
}

