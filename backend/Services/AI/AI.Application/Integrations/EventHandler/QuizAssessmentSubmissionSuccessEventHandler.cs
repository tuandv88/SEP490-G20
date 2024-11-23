using BuildingBlocks.Messaging.Events.Learnings;
using MassTransit;
using Microsoft.KernelMemory;

namespace AI.Application.Integrations.EventHandler;
public class QuizAssessmentSubmissionSuccessEventHandler(IKernelMemory memory, IRecommendationRepository recommendationRepository) : IConsumer<QuizAssessmentSubmissionSuccessEvent> {
    public Task Consume(ConsumeContext<QuizAssessmentSubmissionSuccessEvent> context) {
        throw new NotImplementedException();
    }
}

