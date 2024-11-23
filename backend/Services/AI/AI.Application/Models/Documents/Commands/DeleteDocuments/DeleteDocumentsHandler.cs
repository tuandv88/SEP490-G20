using Microsoft.KernelMemory;

namespace AI.Application.Models.Documents.Commands.DeleteDocuments;
public class DeleteDocumentHandler(IDocumentRepository repository, IKernelMemory memory) : ICommandHandler<DeleteDocumentsCommand, Unit> {
    public async Task<Unit> Handle(DeleteDocumentsCommand request, CancellationToken cancellationToken) {

        foreach (var documentId in request.DocumentIds) {
            var document = await repository.GetByIdAsync(Guid.Parse(documentId));
            if (document != null) {
                if (!document.Tags.TryGetValue(TagConstant.Key.Learning, out _)) {
                    await repository.DeleteAsync(document);
                    await memory.DeleteDocumentAsync(documentId, cancellationToken: cancellationToken);
                }
            }
        }

        await repository.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

