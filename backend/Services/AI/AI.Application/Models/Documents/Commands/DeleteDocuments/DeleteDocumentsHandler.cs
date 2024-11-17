using Microsoft.KernelMemory;
using System.Transactions;

namespace AI.Application.Models.Documents.Commands.DeleteDocuments;
public class DeleteDocumentHandler(IDocumentRepository repository, IKernelMemory memory) : ICommandHandler<DeleteDocumentsCommand, Unit> {
    public async Task<Unit> Handle(DeleteDocumentsCommand request, CancellationToken cancellationToken) {
        using (var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled)) {
            foreach (var documentId in request.DocumentIds) {
                await repository.DeleteByIdAsync(Guid.Parse(documentId));
                await memory.DeleteDocumentAsync(documentId);
            }
            await repository.SaveChangesAsync();

            transaction.Complete();
        }
        return Unit.Value;
    }
}

