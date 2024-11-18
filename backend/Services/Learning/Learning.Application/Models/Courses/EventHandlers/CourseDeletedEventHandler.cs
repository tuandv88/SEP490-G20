
namespace Learning.Application.Models.Courses.EventHandlers;
public class CourseDeletedEventHandler(IOutboxMessageRepository repository) : INotificationHandler<CourseDeletedEvent> {
    public async Task Handle(CourseDeletedEvent notification, CancellationToken cancellationToken) {
        if (notification.Course.CourseStatus == CourseStatus.Published) {
            var outboxMessage = CreateNewOutboxMessage(notification);
            await repository.AddAsync(outboxMessage);
        }
    }
    private OutboxMessage CreateNewOutboxMessage(CourseDeletedEvent @event) {
        var outboxMessage = new OutboxMessage(
                new CourseDeleted(
                    Guid.NewGuid(),
                    DateTime.Now,
                    @event.Course.Id.Value),
                @event.Course.Id.Value.ToString(),
                LearningSyncEventType.Course
            );
        return outboxMessage;
    }
}

