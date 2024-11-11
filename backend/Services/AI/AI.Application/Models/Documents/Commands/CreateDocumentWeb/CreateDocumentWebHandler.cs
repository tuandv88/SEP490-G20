
using AI.Application.Common.Constants;
using AI.Domain.ValueObjects;
using Microsoft.KernelMemory;

namespace AI.Application.Models.Documents.Commands.CreateDocumentWeb;
public class CreateDocumentWebHandler(IDocumentRepository repository, IKernelMemory memory) : ICommandHandler<CreateDocumentWebCommand, CreateDocumentWebResult> {
    public async Task<CreateDocumentWebResult> Handle(CreateDocumentWebCommand request, CancellationToken cancellationToken) {
        var documentIds = new List<Guid>();

        foreach (var url in request.Urls) {
            var fileName = DocumentConstant.Name.ContentUrl;
            var mimeType = ContentTypeConstant.Web.Uri;
            var fileSize = -1;

            var documentId = DocumentId.Of(Guid.NewGuid());

            TagCollection tagCollection = new TagCollection {
                { TagConstant.Key.Type, TagConstant.Import.Web },
                { TagConstant.Key.Url, url },
                { TagConstant.Key.MimeType, mimeType }
            };

            var tags = new Dictionary<string, object>{
                { TagConstant.Key.Type, TagConstant.Import.Web },
                { TagConstant.Key.Url, url },
                { TagConstant.Key.MimeType, mimeType }
            };

            var document = Domain.Models.Document.Create(documentId, fileName, mimeType, fileSize, tags, DocumentConstant.Index.Default);

            await memory.ImportWebPageAsync(url,  documentId.Value.ToString(), tagCollection);

            await repository.AddAsync(document);
            await repository.SaveChangesAsync(cancellationToken);

            documentIds.Add(documentId.Value);
        }

        return new CreateDocumentWebResult(documentIds);
    }
}

