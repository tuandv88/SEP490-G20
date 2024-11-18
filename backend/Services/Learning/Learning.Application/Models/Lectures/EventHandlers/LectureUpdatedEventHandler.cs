using BuildingBlocks.Messaging.Events.Learnings.Lectures;
using Learning.Domain.Events.Lectures;

namespace Learning.Application.Models.Lectures.EventHandlers;
public class LectureUpdatedEventHandler(IOutboxMessageRepository repository, ICourseRepository courseRepository) : INotificationHandler<LectureUpdatedEvent> {
    public async Task Handle(LectureUpdatedEvent notification, CancellationToken cancellationToken) {
        var course = await courseRepository.GetCourseByChapterIdAsync(notification.Lecture.ChapterId.Value);
        if (course != null && course.CourseStatus == CourseStatus.Published) {
            var outboxMessage = CreateNewOutboxMessage(notification);
            await repository.AddAsync(outboxMessage);
        }
    }

    private OutboxMessage CreateNewOutboxMessage(LectureUpdatedEvent @event) {
        var outboxMessage = new OutboxMessage(
            new LectureUpdated(
                 Guid.NewGuid(),
                 DateTime.Now,
                 @event.Lecture.Id.Value,
                 @event.Lecture.ChapterId.Value,
                 @event.Lecture.Title,
                 @event.Lecture.Summary,
                 @event.Lecture.TimeEstimation,
                 @event.Lecture.LectureType.ToString(),
                 @event.Lecture.Point),
            @event.Lecture.Id.Value.ToString(),
            LearningSyncEventType.Lecture
            );
        return outboxMessage;
    }
}

