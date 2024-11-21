using AI.Domain.ValueObjects;
using BuildingBlocks.Messaging.Events.Learnings;
using MassTransit;
using Microsoft.KernelMemory;
using Newtonsoft.Json;
using static AI.Application.Common.Constants.TagConstant;
using Document = AI.Domain.Models.Document;

namespace AI.Application.Models.Documents.EventHandlers.Integration;
public class CoursePublishedEventHandler(
        ILogger<CoursePublishedEventHandler> logger,
        IKernelMemory memory,
        IDocumentRepository repository)
    : IConsumer<CoursePublishedEvent> {
    public async Task Consume(ConsumeContext<CoursePublishedEvent> context) {
        var courseEvent = context.Message.Course;
        logger.LogInformation($"[CoursePublishedEventConsumer] Message: {courseEvent}");

        await ProcessCoursePublished(courseEvent);
    }

    private async Task ProcessCoursePublished(CourseData courseData) {
        logger.LogInformation($"[ProcessCoursePublished] Processing Course Published event for CourseId: {courseData.Id}");

        var courseObject = new {
            courseData.Id,
            courseData.Title,
            courseData.Description,
            courseData.TimeEstimation,
            courseData.OrderIndex,
            courseData.CourseLevel,
            courseData.Price,
            courseData.ImageUrl,
            courseData.CourseStatus,
            courseData.Prerequisites,
            courseData.Objectives,
            courseData.TargetAudiences
        };

        var jsonCourse = JsonConvert.SerializeObject(courseObject);
        var documentCourseId = await ImportCourse(jsonCourse, courseData.Id);
        logger.LogInformation($"[ProcessCoursePublished] Course published successfully with DocumentId: {documentCourseId}");

        // Process Chapters and lecture
        foreach (var chapter in courseData.Chapters) {
            logger.LogInformation($"[ProcessCoursePublished] Processing ChapterId: {chapter.Id} for CourseId: {courseData.Id}");

            var chapterObject = new {
                chapter.Id,
                chapter.CourseId,
                chapter.Title,
                chapter.Description,
                chapter.TimeEstimation,
                chapter.OrderIndex
            };

            var jsonChapter = JsonConvert.SerializeObject(chapterObject);
            var documentChapterId = await ImportChapter(jsonChapter, chapter.Id, courseData.Id.ToString());
            logger.LogInformation($"[ProcessCoursePublished] Chapter published successfully with DocumentId: {documentChapterId}");

            // Process Lectures within each chapter
            foreach (var lecture in chapter.Lectures) {
                logger.LogInformation($"[ProcessCoursePublished] Processing LectureId: {lecture.Id} for ChapterId: {chapter.Id}");

                var lectureObject = new {
                    lecture.Id,
                    lecture.ChapterId,
                    lecture.Title,
                    lecture.Summary,
                    lecture.TimeEstimation,
                    lecture.LectureType,
                    lecture.OrderIndex,
                    lecture.Point,
                    lecture.IsFree
                };

                var jsonLecture = JsonConvert.SerializeObject(lectureObject);
                var documentLectureId = await ImportLecture(jsonLecture, lecture.Id, chapter.Id.ToString(), courseData.Id.ToString());
                logger.LogInformation($"[ProcessCoursePublished] Lecture published successfully with DocumentId: {documentLectureId}");
            }

        }
    }

    private async Task<string> ImportCourse(string json, Guid documentId) {
        var fileName = DocumentConstant.Name.ContentTxt;
        var mimeType = ContentTypeConstant.Web.PlainText;
        var fileSize = -1;


        TagCollection tagCollection = new TagCollection {
            {Key.Type, TagConstant.Import.Text },
            {Key.MimeType, mimeType },
            {Key.Learning, Learning.Course.Name},
            {Learning.Course.CourseId, documentId.ToString()}
         };

        var tags = new Dictionary<string, object>{
            {Key.Type, TagConstant.Import.Text },
            {Key.MimeType, mimeType },
            {Key.Learning, Learning.Course.Name},
            {Learning.Course.CourseId, documentId.ToString()}
        };

        return await Import(json, documentId, fileName, mimeType, fileSize, tags, DocumentConstant.Index.Default, tagCollection);
    }
    private async Task<string> ImportChapter(string json, Guid documentId, string courseId) {

        var fileName = DocumentConstant.Name.ContentTxt;
        var mimeType = ContentTypeConstant.Web.PlainText;
        var fileSize = -1;


        TagCollection tagCollection = new TagCollection {
            {Key.Type, TagConstant.Import.Text },
            {Key.MimeType, mimeType },
            {Key.Learning, Learning.Chapter.Name},
            {Learning.Chapter.ChapterId, documentId.ToString()},
            {Learning.Course.CourseId, courseId }
         };

        var tags = new Dictionary<string, object>{
            {Key.Type, TagConstant.Import.Text },
            {Key.MimeType, mimeType },
            {Key.Learning, TagConstant.Learning.Chapter.Name},
            {Learning.Chapter.ChapterId, documentId.ToString()},
            {Learning.Course.CourseId, courseId }
        };

        return await Import(json, documentId, fileName, mimeType, fileSize, tags, DocumentConstant.Index.Default, tagCollection);
    }
    private async Task<string> ImportLecture(string json, Guid documentId, string chapterId, string courseId) {
        var fileName = DocumentConstant.Name.ContentTxt;
        var mimeType = ContentTypeConstant.Web.PlainText;
        var fileSize = -1;


        TagCollection tagCollection = new TagCollection {
            {Key.Type, TagConstant.Import.Text },
            {Key.MimeType, mimeType },
            {Key.Learning, Learning.Lecture.Name},
            {Learning.Lecture.LectureId, documentId.ToString()},
            {Learning.Chapter.ChapterId, chapterId},
            {Learning.Course.CourseId, courseId }
         };

        var tags = new Dictionary<string, object>{
            {Key.Type, TagConstant.Import.Text },
            {Key.MimeType, mimeType },
            {Key.Learning, Learning.Lecture.Name},
            {Learning.Lecture.LectureId, documentId.ToString()},
            {Learning.Chapter.ChapterId, chapterId},
            {Learning.Course.CourseId, courseId }
        };
        return await Import(json, documentId, fileName, mimeType, fileSize, tags, DocumentConstant.Index.Default, tagCollection);
    }
    private async Task<string> Import(string json, Guid documentId, string fileName, string mimeType,
        long fileSize, Dictionary<string, object> tags, string index, TagCollection tagCollection) {

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

