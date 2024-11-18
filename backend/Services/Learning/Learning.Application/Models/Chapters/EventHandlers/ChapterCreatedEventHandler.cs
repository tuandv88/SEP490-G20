using BuildingBlocks.Messaging.Events.Learnings.Chapters;
using Learning.Domain.Events.Chapters;

namespace Learning.Application.Models.Chapters.EventHandlers;
public class ChapterCreatedEventHandler(IOutboxMessageRepository repository, ICourseRepository courseRepository) : INotificationHandler<ChapterCreatedEvent> {
    public async Task Handle(ChapterCreatedEvent notification, CancellationToken cancellationToken) {
        var course = await courseRepository.GetCourseByChapterIdAsync(notification.Chapter.CourseId.Value);
        if(course != null && course.CourseStatus == CourseStatus.Published) {
            var outboxMessage = CreateNewOutboxMessage(notification);
            await repository.AddAsync(outboxMessage);
        }
    }
    private OutboxMessage CreateNewOutboxMessage(ChapterCreatedEvent @event) {
        var outboxMessage = new OutboxMessage(
                new ChapterCreated(
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

