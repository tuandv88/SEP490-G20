using BuildingBlocks.Messaging.Events.Learnings.Chapters;
using Learning.Application.Data.Repositories;
using Learning.Domain.Events.Chapters;

namespace Learning.Application.Models.Chapters.EventHandlers;
public class ChapterUpdatedEventHandler(IOutboxMessageRepository repository, ICourseRepository courseRepository) : INotificationHandler<ChapterUpdatedEvent> {
    public async Task Handle(ChapterUpdatedEvent notification, CancellationToken cancellationToken) {
        var course = await courseRepository.GetCourseByChapterIdAsync(notification.Chapter.CourseId.Value);
        if (course != null && course.CourseStatus == CourseStatus.Published) {
            var outboxMessage = CreateNewOutboxMessage(notification);
            await repository.AddAsync(outboxMessage);
        }
    }

    private OutboxMessage CreateNewOutboxMessage(ChapterUpdatedEvent @event) {
        var outboxMessage = new OutboxMessage(
                new ChapterUpdated(
                    Guid.NewGuid(),
                    DateTime.Now,
                    @event.Chapter.Id.Value,
                    @event.Chapter.CourseId.Value,
                    @event.Chapter.Title,
                    @event.Chapter.Description,
                    @event.Chapter.TimeEstimation),
                @event.Chapter.Id.Value.ToString(),
                LearningSyncEventType.Chapter
            );
        return outboxMessage;
    }
}

