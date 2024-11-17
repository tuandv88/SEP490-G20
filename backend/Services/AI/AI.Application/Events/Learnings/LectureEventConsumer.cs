using AI.Domain.ValueObjects;
using BuildingBlocks.Messaging.Events.Learnings.Lectures;
using MassTransit;
using Microsoft.KernelMemory;
using Newtonsoft.Json;
using Document = AI.Domain.Models.Document;

namespace AI.Application.Events.Learnings;
public class LectureEventConsumer(ILogger<LectureEventConsumer> logger, IKernelMemory memory, IDocumentRepository repository
    ) : IConsumer<LectureEventBase> {
    public async Task Consume(ConsumeContext<LectureEventBase> context) {
        var lectureEvent = context.Message;
        logger.LogInformation($"[LectureEventConsumer] Message: {lectureEvent}");
        await (lectureEvent.Type switch {
            nameof(LectureCreated) => LectureCreatedHandler((LectureCreated)lectureEvent),
            nameof(LectureUpdated) => LectureUpdatedHandler((LectureUpdated)lectureEvent),
            nameof(LectureDeleted) => LectureDeletedHandler((LectureDeleted)lectureEvent),
            _ => throw new ArgumentOutOfRangeException(nameof(lectureEvent.Type), $"Not expected lecture event: {lectureEvent.Type}")
        });
    }

    private async Task LectureCreatedHandler(LectureCreated lectureCreated) {
        logger.LogInformation($"[LectureCreatedHandler] Processing LectureCreated event for LectureId: {lectureCreated.LectureId}");
        var @object = new {
            lectureCreated.LectureId,
            lectureCreated.ChapterId,
            lectureCreated.Title,
            lectureCreated.Summary,
            lectureCreated.TimeEstimation,
            lectureCreated.LectureType,
            lectureCreated.OrderIndex,
            lectureCreated.Point
        };
        var json = JsonConvert.SerializeObject(@object);
        var documentId = await ImportLecture(json, lectureCreated.LectureId, lectureCreated.ChapterId.ToString());
        logger.LogInformation($"[LectureCreatedHandler] Lecture created successfully with DocumentId: {documentId}");
    }

    private async Task LectureUpdatedHandler(LectureUpdated lectureUpdated) {
        logger.LogInformation($"[LectureUpdatedHandler] Processing LectureUpdated event for LectureId: {lectureUpdated.LectureId}");
        var @object = new {
            lectureUpdated.LectureId,
            lectureUpdated.ChapterId,
            lectureUpdated.Title,
            lectureUpdated.Summary,
            lectureUpdated.TimeEstimation,
            lectureUpdated.LectureType,
            lectureUpdated.OrderIndex,
            lectureUpdated.Point
        };
        var json = JsonConvert.SerializeObject(@object);
        var documentId = await ImportLecture(json, lectureUpdated.LectureId, lectureUpdated.ChapterId.ToString());
        logger.LogInformation($"[LectureUpdatedHandler] Lecture updated successfully with DocumentId: {documentId}");
    }

    private async Task LectureDeletedHandler(LectureDeleted lectureDeleted) {
        logger.LogInformation($"[LectureDeletedHandler] Processing LectureDeleted event for LectureId: {lectureDeleted.LectureId}");
        await memory.DeleteDocumentAsync(lectureDeleted.LectureId.ToString());
        await repository.DeleteByIdAsync(lectureDeleted.LectureId);
        await repository.SaveChangesAsync();
        logger.LogInformation($"[LectureDeletedHandler] Lecture deleted successfully for LectureId: {lectureDeleted.LectureId}");
    }
    private async Task<string> ImportLecture(string json, Guid documentId, string chapterId) {
        var fileName = DocumentConstant.Name.ContentTxt;
        var mimeType = ContentTypeConstant.Web.PlainText;
        var fileSize = -1;


        TagCollection tagCollection = new TagCollection {
            {TagConstant.Key.Type, TagConstant.Import.Text },
            {TagConstant.Key.MimeType, mimeType },
            {TagConstant.Key.Learning, TagConstant.Learning.Lecture.Name},
            {TagConstant.Learning.Lecture.LectureId, documentId.ToString()},
            {TagConstant.Learning.Chapter.ChapterId, chapterId}
         };

        var tags = new Dictionary<string, object>{
            {TagConstant.Key.Type, TagConstant.Import.Text },
            {TagConstant.Key.MimeType, mimeType },
            {TagConstant.Key.Learning, TagConstant.Learning.Lecture.Name},
            {TagConstant.Learning.Lecture.LectureId, documentId.ToString()},
            {TagConstant.Learning.Chapter.ChapterId, chapterId}
        };

        var document = await repository.GetByIdAsync(documentId);
        if(document == null) {
            document = Document.Create(DocumentId.Of(documentId), fileName, mimeType, fileSize, tags, DocumentConstant.Index.Default);
            await repository.AddAsync(document);
        } else {
            document.Update(fileName, mimeType, fileSize, tags, DocumentConstant.Index.Default);
            await repository.UpdateAsync(document);
        }
        await memory.ImportTextAsync(json, documentId.ToString(), tagCollection);

        await repository.SaveChangesAsync();

        return document.Id.ToString();
    }
}

