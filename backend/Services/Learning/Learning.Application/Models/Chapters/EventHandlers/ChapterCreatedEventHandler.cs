using BuildingBlocks.Messaging.Events.Learnings.Chapters;
using Learning.Domain.Events.Chapters;

namespace Learning.Application.Models.Chapters.EventHandlers;
public class ChapterCreatedEventHandler(IOutboxMessageRepository repository) : INotificationHandler<ChapterCreatedEvent> {
    public async Task Handle(ChapterCreatedEvent notification, CancellationToken cancellationToken) {
        var outboxMessage = CreateNewOutboxMessage(notification);
        await repository.AddAsync(outboxMessage);
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
                    @event.Chapter.TimeEstimation,
                    @event.Chapter.OrderIndex),
                @event.Chapter.Id.Value.ToString(),
                LearningSyncEventType.Chapter
            );
        return outboxMessage;
    }
}

