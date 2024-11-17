using BuildingBlocks.Messaging.Events.Learnings.Chapters;
using Learning.Domain.Events.Chapters;

namespace Learning.Application.Models.Chapters.EventHandlers;
public class ChapterDeletedEventHandler(IOutboxMessageRepository repository) : INotificationHandler<ChapterDeletedEvent> {
    public async Task Handle(ChapterDeletedEvent notification, CancellationToken cancellationToken) {
        var outboxMessage = CreateNewOutboxMessage(notification);
        await repository.AddAsync(outboxMessage);
    }

    private OutboxMessage CreateNewOutboxMessage(ChapterDeletedEvent @event) {
        var outboxMessage = new OutboxMessage(
                new ChapterDeleted(
                    Guid.NewGuid(),
                    DateTime.Now,
                    @event.Chapter.Id.Value),
                @event.Chapter.Id.Value.ToString(),
                LearningSyncEventType.Chapter
            );
        return outboxMessage;
    }
}

