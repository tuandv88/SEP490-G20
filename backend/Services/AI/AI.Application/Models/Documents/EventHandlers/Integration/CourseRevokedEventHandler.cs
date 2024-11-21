using BuildingBlocks.Messaging.Events.Learnings;
using MassTransit;
using Microsoft.KernelMemory;

namespace AI.Application.Models.Documents.EventHandlers.Integration;
public class CourseRevokedEventHandler(ILogger<CourseRevokedEventHandler> logger, 
    IDocumentRepository repository, IKernelMemory memory) : IConsumer<CourseRevokedEvent> {
    public async Task Consume(ConsumeContext<CourseRevokedEvent> context) {
        var courseId = context.Message.CourseId;
        logger.LogInformation($"[CourseRevokedEventHandler] Revoking documents for CourseId: {courseId}");

        // Lấy danh sách documentId từ repository dựa trên tag CourseId
        var documentIds = await repository.GetDocumentIdsByTagAsync(TagConstant.Learning.Course.CourseId, courseId.ToString());
        if (documentIds == null || !documentIds.Any()) {
            logger.LogWarning($"[CourseRevokedEventHandler] No documents found for CourseId: {courseId}");
            return;
        }

        logger.LogInformation($"[CourseRevokedEventHandler] Found {documentIds.Count()} documents for deletion.");

        foreach (var documentId in documentIds) {
            logger.LogInformation($"[CourseRevokedEventHandler] Deleting document with ID: {documentId}");

            await memory.DeleteDocumentAsync(documentId.ToString());

            await repository.DeleteByIdAsync(documentId);
        }
        await repository.SaveChangesAsync();

        logger.LogInformation($"[CourseRevokedEventHandler] Completed revocation for CourseId: {courseId}");
    }
}

