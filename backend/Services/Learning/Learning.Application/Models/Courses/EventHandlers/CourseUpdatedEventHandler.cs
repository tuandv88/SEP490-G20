namespace Learning.Application.Models.Courses.EventHandlers;
public class CourseUpdatedEventHandler(IOutboxMessageRepository repository) : INotificationHandler<CourseUpdatedEvent> {
    public async Task Handle(CourseUpdatedEvent notification, CancellationToken cancellationToken) {
        if (notification.Course.CourseStatus == CourseStatus.Published) {
            var outboxMessage = CreateNewOutboxMessage(notification);
            await repository.AddAsync(outboxMessage);
        }
    }

    private OutboxMessage CreateNewOutboxMessage(CourseUpdatedEvent @event) {
        var outboxMessage = new OutboxMessage(
                new CourseUpdated(
                    Guid.NewGuid(),
                    DateTime.Now,
                    @event.Course.Id.Value,
                    @event.Course.Title,
                    @event.Course.Description,
                    @event.Course.Headline,
                    @event.Course.TimeEstimation,
                    @event.Course.Prerequisites,
                    @event.Course.Objectives,
                    @event.Course.TargetAudiences,
                    @event.Course.CourseLevel.ToString(),
                    @event.Course.Price),
                @event.Course.Id.Value.ToString(),
                LearningSyncEventType.Course
            );
        return outboxMessage;
    }
}

