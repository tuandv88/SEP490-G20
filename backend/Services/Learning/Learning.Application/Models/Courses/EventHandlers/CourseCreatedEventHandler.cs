namespace Learning.Application.Models.Courses.EventHandlers;
public class CourseCreatedEventHandler(IOutboxMessageRepository repository) : INotificationHandler<CourseCreatedEvent> {
    public async Task Handle(CourseCreatedEvent notification, CancellationToken cancellationToken) {
        var outboxMessage = CreateNewOutboxMessage(notification);
        await repository.AddAsync(outboxMessage);
    }

    private OutboxMessage CreateNewOutboxMessage(CourseCreatedEvent @event) {
        var outboxMessage = new OutboxMessage(
                new CourseCreated(
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
                    @event.Course.OrderIndex,
                    @event.Course.CourseLevel.ToString(),
                    @event.Course.Price),
                @event.Course.Id.Value.ToString(),
                LearningSyncEventType.Course
            );
        return outboxMessage;
    }
}

