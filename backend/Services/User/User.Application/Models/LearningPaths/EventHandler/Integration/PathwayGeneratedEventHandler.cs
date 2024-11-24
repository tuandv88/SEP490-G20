using BuildingBlocks.Messaging.Events.AIs;
using MassTransit;

namespace User.Application.Models.LearningPaths.EventHandler.Integration;
public class PathwayGeneratedEventHandler : IConsumer<PathwayGeneratedEvent> {
    public Task Consume(ConsumeContext<PathwayGeneratedEvent> context) {
        throw new NotImplementedException();
    }
}

