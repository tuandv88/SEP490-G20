using AI.Domain.Enums;
using AI.Domain.ValueObjects;
using Amazon.Runtime.Internal.Transform;
using BuildingBlocks.Messaging.Events.AIs;
using BuildingBlocks.Messaging.Events.Learnings;
using MassTransit;
using Microsoft.KernelMemory;
using Newtonsoft.Json;

namespace AI.Application.Integrations.EventHandler;
public class AssessmentQuizScoringCompletedEventHandler(IKernelMemory memory, IRecommendationRepository recommendationRepository, 
    IMessageService messageService, IChatService chatService, IPublishEndpoint publishEndpoint) : IConsumer<AssessmentQuizScoringCompletedEvent> {
    public async Task Consume(ConsumeContext<AssessmentQuizScoringCompletedEvent> context) {
        var @event = context.Message;

        var quizAnswers = JsonConvert.SerializeObject(@event);
        var facts = await BuildFacts();
        //tạo context
        var messageContext = new Interfaces.MessageContext(new Dictionary<string, object?>() {
            {ContextConstant.Pathway.Answer, quizAnswers},
            {ContextConstant.Rag.MaxTokens,  5000}
        });
        var prompt = messageService.BuildPrompt(PromptType.Pathway, "", facts, messageContext);
        var answer = await chatService.GenerateAnswer(prompt, messageContext);
        var recommendation = CreateNewRecommendation(answer, quizAnswers, @event.UserId);

        await recommendationRepository.AddAsync(recommendation);
        await publishEndpoint.Publish(new PathwayGeneratedEvent() {
            UserId = @event.UserId,
            PathwayName = answer.PathwayName,
            PathSteps = answer.PathSteps.Select(p => new PathStepGenerated() {
                CourseId = p.CourseId, 
                EstimatedCompletionTime = p.EstimatedCompletionTime }).ToList(),
            EstimatedCompletionTime = answer.EstimatedCompletionTime,
            Reason = answer.Reason
        });
        await recommendationRepository.SaveChangesAsync();
    }

    private async Task<string> BuildFacts() {
        var filter = MemoryFilters.ByTag(TagConstant.Key.Learning, TagConstant.Learning.Course.Name);
        var searchResult = await memory.SearchAsync("", DocumentConstant.Index.Default, filter: filter);
        var citations = searchResult.Results;
        var listResults = new List<string>();
        if (citations != null) {
            foreach( var citation in citations) {
                listResults.AddRange(citation.Partitions.Select(p => p.Text));
            }
        }
        return JsonConvert.SerializeObject(listResults);
    }

    private Recommendation CreateNewRecommendation(PathwayAnswer answer, string source, Guid userId) {
      return  Recommendation.Create(
                RecommendationId.Of(Guid.NewGuid()),
                UserId.Of(userId),
                answer.PathwayName,
                JsonConvert.SerializeObject(answer),
                source,
                answer.Reason,
                DateTime.UtcNow,
                DateTime.UtcNow + answer.EstimatedCompletionTime);
    }
}
