using System.ComponentModel;

namespace AI.Infrastructure.Plugins;
public class DocumentPlugin(IDocumentService documentService) {

    [KernelFunction, Description("Retrieves a Markdown link to the specified document using its DocumentId. Returns 'Not Found' if the document does not exist.")]
    public async Task<string> GetDocumentMarkdownLink(
       Guid documentId
       ) {
        var dbContext = UtilsDbContext.GetDbContext();
        var document = dbContext.Documents.FirstOrDefault(d => d.Id.Equals(DocumentId.Of(documentId)));
        if (document == null) {
            return "Not Found";
        }
        var link = await documentService.GetDocumentLink(document);
        var markdownLink = $"[{document.FileName}]({link})";

        return markdownLink;
    }
}

