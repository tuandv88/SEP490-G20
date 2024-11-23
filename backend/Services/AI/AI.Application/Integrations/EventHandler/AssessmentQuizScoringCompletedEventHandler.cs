using BuildingBlocks.Messaging.Events.Learnings;
using MassTransit;

namespace AI.Application.Integrations.EventHandler;
public class AssessmentQuizScoringCompletedEventHandler : IConsumer<AssessmentQuizScoringCompletedEvent> {
    public Task Consume(ConsumeContext<AssessmentQuizScoringCompletedEvent> context) {
        throw new NotImplementedException();
    }
}
