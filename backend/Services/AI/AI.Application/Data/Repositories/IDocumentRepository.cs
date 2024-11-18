namespace AI.Application.Data.Repositories;
public interface IDocumentRepository : IRepository<Document>{
    Task<List<Document>?> GetDocuments(params Guid[] documentIds);
}

