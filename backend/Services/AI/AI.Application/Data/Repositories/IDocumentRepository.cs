using AI.Domain.ValueObjects;

namespace AI.Application.Data.Repositories;
public interface IDocumentRepository : IRepository<Document>{
    Task<List<Document>?> GetDocumentsAsync(params DocumentId[] documentIds);
    Task DeleteDocumentsByTagAsync(string tagName, string tagValue);
    Task<List<Guid>> GetDocumentIdsByTagAsync(string tagName, string tagValue);

}

