using AI.Domain.Enums;
using Amazon.Runtime.Internal.Transform;
using BuildingBlocks.Messaging.Events.Learnings;
using MassTransit;
using Microsoft.KernelMemory;
using Newtonsoft.Json;

namespace AI.Application.Integrations.EventHandler;
public class AssessmentQuizScoringCompletedEventHandler(IKernelMemory memory, IRecommendationRepository recommendation, IMessageService messageService,
    IChatService chatService) : IConsumer<AssessmentQuizScoringCompletedEvent> {
    public async Task Consume(ConsumeContext<AssessmentQuizScoringCompletedEvent> context) {
        var @event = context.Message;

        var quizAnswers = JsonConvert.SerializeObject(@event);
        var facts = await BuildFacts();
        //tạo context
        var messageContext = new Interfaces.MessageContext(new Dictionary<string, object?>() {
            {ContextConstant.Pathway.Answer, quizAnswers},
            {ContextConstant.Rag.MaxTokens,  100*1000}
        });
        var prompt = messageService.BuildPrompt(PromptType.Pathway, "", facts, messageContext);
        var answers = await chatService.GenerateAnswer(prompt, messageContext);



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
}
