using AI.Domain.ValueObjects;
using BuildingBlocks.Messaging.Events.Learnings.Chapters;
using MassTransit;
using Microsoft.KernelMemory;
using Newtonsoft.Json;
using System.Threading;
using Document = AI.Domain.Models.Document;

namespace AI.Application.Events.Learnings;
public class ChapterEventConsumer(ILogger<ChapterEventConsumer> logger, IKernelMemory memory, IDocumentRepository repository
    ) : IConsumer<ChapterEventBase> {
    public async Task Consume(ConsumeContext<ChapterEventBase> context) {
        var chapterEvent = context.Message;
        logger.LogInformation($"[ChapterEventConsumer] Message: {chapterEvent}");
        await (chapterEvent.Type switch {
            nameof(ChapterCreated) => ChapterCreatedHandler((ChapterCreated)chapterEvent),
            nameof(ChapterUpdated) => ChapterUpdatedHandler((ChapterUpdated)chapterEvent),
            nameof(ChapterDeleted) => ChapterDeletedHandler((ChapterDeleted)chapterEvent),
            _ => throw new ArgumentOutOfRangeException(nameof(chapterEvent.Type), $"Not expected chapter event: {chapterEvent.Type}")
        });
    }

    private async Task ChapterCreatedHandler(ChapterCreated chapterCreated) {
        logger.LogInformation($"[ChapterCreatedHandler] Processing ChapterCreated event for ChapterId: {chapterCreated.ChapterId}");
        var @object = new {
            chapterCreated.ChapterId,
            chapterCreated.CourseId,
            chapterCreated.Title,
            chapterCreated.Description,
            chapterCreated.TimeEstimation
        };
        var json = JsonConvert.SerializeObject(@object);
        var documentId = await ImportChapter(json, chapterCreated.ChapterId, chapterCreated.CourseId.ToString());
        logger.LogInformation($"[ChapterCreatedHandler] Chapter updated successfully with DocumentId: {documentId}");
    }

    private async Task ChapterUpdatedHandler(ChapterUpdated chapterUpdated) {
        logger.LogInformation($"[ChapterUpdatedHandler] Processing LectureUpdated event for ChapterId: {chapterUpdated.ChapterId}");
        var @object = new {
            chapterUpdated.ChapterId,
            chapterUpdated.CourseId,
            chapterUpdated.Title,
            chapterUpdated.Description,
            chapterUpdated.TimeEstimation
        };
        var json = JsonConvert.SerializeObject(@object);
        var documentId = await ImportChapter(json, chapterUpdated.ChapterId, chapterUpdated.CourseId.ToString());
        logger.LogInformation($"[ChapterUpdatedHandler] Lecture updated successfully with DocumentId: {documentId}");
    }

    private async Task ChapterDeletedHandler(ChapterDeleted chapterDeleted) {
        logger.LogInformation($"[ChapterDeletedHandler] Processing LectureDeleted event for ChapterId: {chapterDeleted.ChapterId}");
        await memory.DeleteDocumentAsync(chapterDeleted.ChapterId.ToString());
        await repository.DeleteByIdAsync(chapterDeleted.ChapterId);
        await repository.SaveChangesAsync();
        logger.LogInformation($"[ChapterDeletedHandler] Lecture deleted successfully for ChapterId: {chapterDeleted.ChapterId}");
    }
    private async Task<string> ImportChapter(string json, Guid documentId, string courseId) {

        var fileName = DocumentConstant.Name.ContentTxt;
        var mimeType = ContentTypeConstant.Web.PlainText;
        var fileSize = -1;


        TagCollection tagCollection = new TagCollection {
            {TagConstant.Key.Type, TagConstant.Import.Text },
            {TagConstant.Key.MimeType, mimeType },
            {TagConstant.Key.Learning, TagConstant.Learning.Chapter.Name},
            {TagConstant.Learning.Chapter.ChapterId, documentId.ToString()},
            {TagConstant.Learning.Course.CourseId, courseId }
         };

        var tags = new Dictionary<string, object>{
            {TagConstant.Key.Type, TagConstant.Import.Text },
            {TagConstant.Key.MimeType, mimeType },
            {TagConstant.Key.Learning, TagConstant.Learning.Chapter.Name},
            {TagConstant.Learning.Chapter.ChapterId, documentId.ToString()},
            {TagConstant.Learning.Course.CourseId, courseId }
        };

        var document = await repository.GetByIdAsync(documentId);
        if (document == null) {
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

