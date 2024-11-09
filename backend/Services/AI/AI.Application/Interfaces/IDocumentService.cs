using Microsoft.KernelMemory;

namespace AI.Application.Interfaces;
public interface IDocumentService {
    Task<List<string>> GetDocumentMarkdownLinks(List<string> documentId, MemoryAnswer answer);
    Task<List<string>> GetDocumentMarkdownLinks(List<Domain.Models.Document> documents); 
    Task<string> GetDocumentLink(Domain.Models.Document document);
}


