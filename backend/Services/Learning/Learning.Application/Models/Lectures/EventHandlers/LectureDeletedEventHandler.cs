using BuildingBlocks.Messaging.Events.Learnings.Lectures;
using Learning.Domain.Events.Lectures;

namespace Learning.Application.Models.Lectures.EventHandlers;
public class LectureDeletedEventHandler(IOutboxMessageRepository repository) : INotificationHandler<LectureDeletedEvent> {
    public async Task Handle(LectureDeletedEvent notification, CancellationToken cancellationToken) {
        var outboxMessage = CreateNewOutboxMessage(notification);
        await repository.AddAsync(outboxMessage);
    }

    private OutboxMessage CreateNewOutboxMessage(LectureDeletedEvent @event) {
        var outboxMessage = new OutboxMessage(
               new LectureDeleted(
                   Guid.NewGuid(),
                   DateTime.Now,
                   @event.Lecture.Id.Value),
               @event.Lecture.Id.Value.ToString(),
               LearningSyncEventType.Lecture
           );
        return outboxMessage;
    }
}

