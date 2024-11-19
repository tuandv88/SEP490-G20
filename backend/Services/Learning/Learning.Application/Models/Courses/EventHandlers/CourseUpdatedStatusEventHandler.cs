using BuildingBlocks.Messaging.Events.Learnings;
using Learning.Domain.Events;
using MassTransit;

namespace Learning.Application.Models.Courses.EventHandlers;
public class CourseUpdatedStatusEventHandler(IPublishEndpoint publishEndpoint) : INotificationHandler<CourseUpdatedStatusEvent> {
    public async Task Handle(CourseUpdatedStatusEvent notification, CancellationToken cancellationToken) {
        //publish event ra ở đây
        if (notification.Course.CourseStatus == CourseStatus.Published) {
            var @event = MapData(notification.Course);
            await publishEndpoint.Publish(@event, cancellationToken);
        } else {
            var @event = new CourseRevokedEvent(notification.Course.Id.Value);
            await publishEndpoint.Publish(@event, cancellationToken);
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
            Lectures = chapter.Lectures.Select(lecture => new LectureData() {
                Id = lecture.Id.Value,
                ChapterId = chapter.Id.Value,
                Title = lecture.Title,
                Summary = lecture.Summary,
                TimeEstimation = lecture.TimeEstimation,
                LectureType = lecture.LectureType.ToString(),
                OrderIndex = lecture.OrderIndex,
                Point = lecture.Point,
                IsFree = lecture.IsFree
            }).ToList()
        }).ToList();

        courseData.Chapters = chaptersData;

        return new CoursePublishedEvent(courseData);
    }
}

