using BuildingBlocks.Caching;
using BuildingBlocks.Messaging.Events.Learnings;
using Learning.Domain.Events;
using MassTransit;
using File = BuildingBlocks.Messaging.Events.Learnings.File;

namespace Learning.Application.Models.Courses.EventHandlers;
public class CourseUpdatedStatusEventHandler(IPublishEndpoint publishEndpoint, IMessageScheduler scheduler, 
    ICacheService cacheService, IFileRepository fileRepository) : INotificationHandler<CourseUpdatedStatusEvent> {
    public async Task Handle(CourseUpdatedStatusEvent notification, CancellationToken cancellationToken) {
        //publish event ra ở đây
        var course = notification.Course;
        var courseStatus = course.CourseStatus;
        var scheduleTime = course.ScheduledPublishDate;
        switch (courseStatus) {
            case CourseStatus.Published:
                await publishEndpoint.Publish(MapData(notification.Course), cancellationToken);
                break;
            case CourseStatus.Scheduled:
                if (scheduleTime.HasValue) {
                    var message = await scheduler.SchedulePublish(scheduleTime.Value- TimeSpan.FromSeconds(10), new CourseScheduledEvent(notification.Course.Id.Value), cancellationToken);
                    var key = string.Format(RedisRepoKey.CourseTokenId, course.Id.Value);
                    await cacheService.SetAsync(key, message.TokenId, scheduleTime.Value - DateTime.UtcNow);
                }
                await publishEndpoint.Publish(new CourseRevokedEvent(notification.Course.Id.Value), cancellationToken);
                break;
            default:
                await publishEndpoint.Publish(new CourseRevokedEvent(notification.Course.Id.Value), cancellationToken);
                break;
        }
    }
    private CoursePublishedEvent MapData(Course course) {

        var courseData = new CourseData() {
            Id = course.Id.Value,
            Title = course.Title,
            Description = course.Description,
            Headline = course.Headline,
            CourseStatus = course.CourseStatus.ToString(),
            TimeEstimation = course.TimeEstimation,
            Prerequisites = course.Prerequisites,
            Objectives = course.Objectives,
            TargetAudiences = course.TargetAudiences,
            ScheduledPublishDate = course.ScheduledPublishDate,
            ImageUrl = course.ImageUrl,
            OrderIndex = course.OrderIndex,
            CourseLevel = course.CourseLevel.ToString(),
            Price = course.Price,
        };

        var chaptersData = course.Chapters.Select(chapter => new ChapterData() {
            Id = chapter.Id.Value,
            CourseId = course.Id.Value,
            Title = chapter.Title,
            Description = chapter.Description,
            TimeEstimation = chapter.TimeEstimation,
            OrderIndex = chapter.OrderIndex,
            Lectures = chapter.Lectures.Select(lecture => {
                var files = fileRepository.GetDocumentByLectureId(lecture.Id) ;

                return new LectureData() {
                    Id = lecture.Id.Value,
                    ChapterId = chapter.Id.Value,
                    Title = lecture.Title,
                    Summary = lecture.Summary,
                    TimeEstimation = lecture.TimeEstimation,
                    LectureType = lecture.LectureType.ToString(),
                    OrderIndex = lecture.OrderIndex,
                    Point = lecture.Point,
                    IsFree = lecture.IsFree,
                    Files = files.Select(f => new File() {
                        Id = f.Id.Value,
                        FileName = f.FileName,
                        FileSize = f.FileSize,
                        Url = f.Url,
                        Format = f.Format
                    }).ToList()
                };
            }).ToList()
        }).ToList();

        courseData.Chapters = chaptersData;

        return new CoursePublishedEvent(courseData);
    }
}

