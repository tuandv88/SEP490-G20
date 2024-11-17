using AI.Domain.ValueObjects;
using BuildingBlocks.Messaging.Events.Learnings.Courses;
using MassTransit;
using Microsoft.KernelMemory;
using Newtonsoft.Json;
using Document = AI.Domain.Models.Document;

namespace AI.Application.Events.Learnings;
public class CourseEventConsumer(ILogger<CourseEventConsumer> logger, IKernelMemory memory, IDocumentRepository repository
    ) : IConsumer<CourseEventBase> {
    public async Task Consume(ConsumeContext<CourseEventBase> context) {
        var courseEvent = context.Message;
        logger.LogInformation($"[CourseEventConsumer] Message: {courseEvent}");
        await (courseEvent.Type switch {
            nameof(CourseCreated) => CourseCreatedHandler((CourseCreated)courseEvent),
            nameof(CourseUpdated) => CourseUpdatedHandler((CourseUpdated)courseEvent),
            nameof(CourseDeleted) => CourseDeletedHandler((CourseDeleted)courseEvent),
            _ => throw new ArgumentOutOfRangeException(nameof(courseEvent.Type), $"Not expected course event: {courseEvent.Type}")
        });
    }

    private async Task CourseCreatedHandler(CourseCreated courseCreated) {
        logger.LogInformation($"[CourseCreatedHandler] Processing CourseCreated event for CourseId: {courseCreated.CourseId}");
        var @object = new {
            courseCreated.CourseId,
            courseCreated.Title,
            courseCreated.Description,
            courseCreated.Headline,
            courseCreated.TimeEstimation,
            courseCreated.Prerequisites,
            courseCreated.Objectives,
            courseCreated.TargetAudiences,
            courseCreated.OrderIndex,
            courseCreated.CourseLevel,
            courseCreated.Price
        };
        var json = JsonConvert.SerializeObject(@object);
        var documentId = await ImportCourse(json, courseCreated.CourseId);
        logger.LogInformation($"[CourseCreatedHandler] Course created successfully with DocumentId: {documentId}");
    }

    private async Task CourseUpdatedHandler(CourseUpdated courseUpdated) {
        logger.LogInformation($"[CourseUpdatedHandler] Processing CourseUpdated event for CourseId: {courseUpdated.CourseId}");
        var @object = new {
            courseUpdated.CourseId,
            courseUpdated.Title,
            courseUpdated.Description,
            courseUpdated.Headline,
            courseUpdated.TimeEstimation,
            courseUpdated.Prerequisites,
            courseUpdated.Objectives,
            courseUpdated.TargetAudiences,
            courseUpdated.OrderIndex,
            courseUpdated.CourseLevel,
            courseUpdated.Price
        };
        var json = JsonConvert.SerializeObject(@object);
        var documentId = await ImportCourse(json, courseUpdated.CourseId);
        logger.LogInformation($"[CourseUpdatedHandler] Course updated successfully with DocumentId: {documentId}");
    }

    private async Task CourseDeletedHandler(CourseDeleted courseDeleted) {
        logger.LogInformation($"[CourseDeletedHandler] Processing CourseDeleted event for CourseId: {courseDeleted.CourseId}");
        await memory.DeleteDocumentAsync(courseDeleted.CourseId.ToString());
        await repository.DeleteByIdAsync(courseDeleted.CourseId);
        await repository.SaveChangesAsync();
        logger.LogInformation($"[CourseDeletedHandler] Course deleted successfully for CourseId: {courseDeleted.CourseId}");

    }
    private async Task<string> ImportCourse(string json, Guid documentId) {
        var fileName = DocumentConstant.Name.ContentTxt;
        var mimeType = ContentTypeConstant.Web.PlainText;
        var fileSize = -1;


        TagCollection tagCollection = new TagCollection {
            {TagConstant.Key.Type, TagConstant.Import.Text },
            {TagConstant.Key.MimeType, mimeType },
            {TagConstant.Key.Learning, TagConstant.Learning.Course.Name},
            {TagConstant.Learning.Course.CourseId, documentId.ToString()}
         };

        var tags = new Dictionary<string, object>{
            {TagConstant.Key.Type, TagConstant.Import.Text },
            {TagConstant.Key.MimeType, mimeType },
            {TagConstant.Key.Learning, TagConstant.Learning.Course.Name},
            {TagConstant.Learning.Course.CourseId, documentId.ToString()}
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

