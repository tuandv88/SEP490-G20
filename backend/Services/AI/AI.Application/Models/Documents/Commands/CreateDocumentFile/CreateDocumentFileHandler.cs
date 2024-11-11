using AI.Application.Common.Constants;
using AI.Domain.ValueObjects;
using Microsoft.KernelMemory;

namespace AI.Application.Models.Documents.Commands.CreateDocumentFile;
public class CreateDocumentFileHandler(IKernelMemory memory, IDocumentRepository repository) : ICommandHandler<CreateDocumentFileCommand, CreateDocumentFileResult> {
    public async Task<CreateDocumentFileResult> Handle(CreateDocumentFileCommand request, CancellationToken cancellationToken) {
        var documentIds = new List<Guid>();

        foreach (var file in request.Files) {
            var fileName = file.FileName;
            var mimeType = file.ContentType;
            var fileSize = file.Length;

            var documentId = DocumentId.Of(Guid.NewGuid());

            TagCollection tagCollection = new TagCollection {
                { TagConstant.Key.Type, TagConstant.Import.Document },
                { TagConstant.Key.MimeType, mimeType }
            };

            var tags = new Dictionary<string, object>{
                { TagConstant.Key.Type, TagConstant.Import.Document },
                { TagConstant.Key.MimeType, mimeType }
            };
            var document = Domain.Models.Document.Create(documentId, fileName, mimeType, fileSize, tags, DocumentConstant.Index.Default);

            await memory.ImportDocumentAsync(file.OpenReadStream(), fileName, documentId.Value.ToString(), tagCollection);

            await repository.AddAsync(document);
            await repository.SaveChangesAsync(cancellationToken);

            documentIds.Add(documentId.Value);
        }

        return new CreateDocumentFileResult(documentIds);
    }
}

