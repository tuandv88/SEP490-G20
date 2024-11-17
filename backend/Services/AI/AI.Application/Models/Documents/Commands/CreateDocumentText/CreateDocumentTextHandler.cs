using AI.Domain.ValueObjects;
using Microsoft.KernelMemory;

namespace AI.Application.Models.Documents.Commands.CreateDocumentText;
public class CreateDocumentTextHandler(IDocumentRepository repository, IKernelMemory memory) : ICommandHandler<CreateDocumentTextCommand, CreateDocumentTextResult> {
    public async Task<CreateDocumentTextResult> Handle(CreateDocumentTextCommand request, CancellationToken cancellationToken) {

        var fileName = DocumentConstant.Name.ContentTxt;
        var mimeType = ContentTypeConstant.Web.PlainText;
        var fileSize = -1;

        var documentId = DocumentId.Of(Guid.NewGuid());

        TagCollection tagCollection = new TagCollection {
                { TagConstant.Key.Type, TagConstant.Import.Text },
                { TagConstant.Key.MimeType, mimeType }
            };

        var tags = new Dictionary<string, object>{
                { TagConstant.Key.Type, TagConstant.Import.Text },
                { TagConstant.Key.MimeType, mimeType }
            };

        var document = Domain.Models.Document.Create(documentId, fileName, mimeType, fileSize, tags, DocumentConstant.Index.Default);

        await memory.ImportTextAsync(request.Text, documentId.Value.ToString(), tagCollection);

        await repository.AddAsync(document);
        await repository.SaveChangesAsync(cancellationToken);

        return new CreateDocumentTextResult(documentId.Value);
    }
}

