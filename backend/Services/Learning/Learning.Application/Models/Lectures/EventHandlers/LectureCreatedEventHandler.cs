using BuildingBlocks.Messaging.Events.Learnings.Lectures;
using Learning.Domain.Events.Lectures;

namespace Learning.Application.Models.Lectures.EventHandlers;
public class LectureCreatedEventHandler(IOutboxMessageRepository repository) : INotificationHandler<LectureCreatedEvent> {
    public async Task Handle(LectureCreatedEvent notification, CancellationToken cancellationToken) {
        var outboxMessage = CreateNewOutboxMessage(notification);
        await repository.AddAsync(outboxMessage);
    }

    private OutboxMessage CreateNewOutboxMessage(LectureCreatedEvent @event) {
        var outboxMessage = new OutboxMessage(
            new LectureCreated(
                 Guid.NewGuid(),
                 DateTime.Now,
                 @event.Lecture.Id.Value,
                 @event.Lecture.ChapterId.Value,
                 @event.Lecture.Title,
                 @event.Lecture.Summary,
                 @event.Lecture.TimeEstimation,
                 @event.Lecture.LectureType.ToString(),
                 @event.Lecture.OrderIndex,
                 @event.Lecture.Point),
            @event.Lecture.Id.Value.ToString(),
            LearningSyncEventType.Lecture
            );
        return outboxMessage;
    }
}

