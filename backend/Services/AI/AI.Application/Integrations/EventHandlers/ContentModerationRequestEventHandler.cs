using AI.Domain.Enums;
using AI.Domain.ValueObjects;
using BuidingBlocks.Storage;
using BuidingBlocks.Storage.Interfaces;
using BuildingBlocks.Messaging.Events.Communities;
using BuildingBlocks.Messaging.Events.Communitiesp;
using MassTransit;
using Newtonsoft.Json;

namespace AI.Application.Integrations.EventHandlers;
public class ContentModerationRequestEventHandler(IChatService chatService, IMessageService messageService, 
    IRecommendationRepository recommendationRepository, IPublishEndpoint publishEndpoint, IFilesService filesService) : IConsumer<ContentModerationRequestEvent> {
    public async Task Consume(ConsumeContext<ContentModerationRequestEvent> context) {
        var @event = context.Message;

        var discusstionJson = JsonConvert.SerializeObject(new {
            @event.CategoryName,
            @event.Title,
            @event.Description,
            @event.Tags
        });
        //tạo context
        var messageContext = new Interfaces.MessageContext(new Dictionary<string, object?>() {
            {ContextConstant.ContentModeration.Discussion, discusstionJson},
            {ContextConstant.ContentModeration.ImageUrl, @event.ImageUrl},
            {ContextConstant.Rag.MaxTokens,  1000}
        });
        var prompt = messageService.BuildPrompt(PromptType.ContentModeration, "", discusstionJson, messageContext);
        string? images = null;
        if(@event.ImageUrl!=null) {
            var s3Object = await filesService.GetFileAsync(StorageConstants.BUCKET, @event.ImageUrl, 60*24*7);
            images = s3Object?.PresignedUrl;
        }
        var answer = await chatService.GenerateAnswer(prompt, images, messageContext);
        var recommendation = CreateNewRecommendation(answer, discusstionJson, @event.UserId);

        await recommendationRepository.AddAsync(recommendation);
        await publishEndpoint.Publish(new ContentModerationResultEvent() {
            DiscusstionId = @event.DiscussionId,
            FullName = @event.FullName,
            Email = @event.Email,
            ViolationLevel = answer.ViolationLevel,
            Reason = answer.Reason, 
        });

        await recommendationRepository.SaveChangesAsync();
    }

    private Recommendation CreateNewRecommendation(FlagAnswer answer, string source, Guid userId) {
        return Recommendation.Create(
                  RecommendationId.Of(Guid.NewGuid()),
                  UserId.Of(userId),
                  ContextConstant.ContentModeration.Discussion,
                  JsonConvert.SerializeObject(answer),
                  source,
                  answer.Reason,
                  DateTime.UtcNow,
                  DateTime.UtcNow);
    }
}

