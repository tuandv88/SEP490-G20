using BuildingBlocks.Messaging.Events.Learnings.Chapters;
using Learning.Domain.Events.Chapters;

namespace Learning.Application.Models.Chapters.EventHandlers;
public class ChapterUpdatedEventHandler(IOutboxMessageRepository repository) : INotificationHandler<ChapterUpdatedEvent> {
    public async Task Handle(ChapterUpdatedEvent notification, CancellationToken cancellationToken) {
        var outboxMessage = CreateNewOutboxMessage(notification);
        await repository.AddAsync(outboxMessage);
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
                    @event.Chapter.TimeEstimation,
                    @event.Chapter.OrderIndex),
                @event.Chapter.Id.Value.ToString(),
                LearningSyncEventType.Chapter
            );
        return outboxMessage;
    }
}

