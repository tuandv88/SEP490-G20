using AI.Application.Interfaces;
using AI.Domain.ValueObjects;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.KernelMemory;
using Newtonsoft.Json;
using System.Text;
using System.Text.RegularExpressions;
#pragma warning disable SKEXP0010
namespace AI.Infrastructure.Services;
public class ConversationalAIService(
    Kernel kernel, SearchClientConfig _config, IConversationRepository conversationRepository, ILogger<ConversationalAIService> logger,
    IConfiguration configuration
    ) : IChatService {

    public async Task<MessageAnswer> GenerateAnswer(Guid conversationId, string prompt, IMessageContext? context = default, CancellationToken token = default) {
        if (prompt.IsNullOrEmpty()) {
            throw new ArgumentException("Prompt cannot be null or empty.", nameof(prompt));
        }
        int maxTokens = context.GetCustomRagMaxTokensOrDefault(_config.AnswerTokens);
        double temperature = context.GetCustomRagTemperatureOrDefault(_config.Temperature);
        double nucleusSampling = context.GetCustomRagNucleusSamplingOrDefault(_config.TopP);

        AzureOpenAIPromptExecutionSettings settings = new() {
            ToolCallBehavior = ToolCallBehavior.AutoInvokeKernelFunctions,
            MaxTokens = maxTokens,
            Temperature = temperature,
            TopP = nucleusSampling,
            PresencePenalty = _config.PresencePenalty,
            FrequencyPenalty = _config.FrequencyPenalty,
            StopSequences = _config.StopSequences,
            //ResponseFormat = typeof(MessageAnswer),
        };
        var chatCompletionService = kernel.GetRequiredService<IChatCompletionService>();
        var chatHistory = await GetRecentChatHistory(conversationId);

        //Thêm câu hỏi cho user
        chatHistory.AddUserMessage(prompt);
        var result = chatCompletionService.GetStreamingChatMessageContentsAsync(chatHistory, settings, kernel, token);
        StringBuilder fullMessage = new();
        await foreach (var content in result) {
            fullMessage.Append(content.Content);
        }
        MessageAnswer messageAnswer = new MessageAnswer();
        try {
            messageAnswer = JsonConvert.DeserializeObject<MessageAnswer>(fullMessage.ToString())!;
        } catch (Exception ex) {
            logger.LogError(ex.Message);
            messageAnswer.Answer = fullMessage.ToString() ?? _config.EmptyAnswer;
        }
        return messageAnswer;
    }

    public async Task<PathwayAnswer> GenerateAnswer(string prompt, IMessageContext? context, CancellationToken token = default) {
        int maxTokens = context.GetCustomRagMaxTokensOrDefault(_config.AnswerTokens);
        double temperature = context.GetCustomRagTemperatureOrDefault(_config.Temperature);
        double nucleusSampling = context.GetCustomRagNucleusSamplingOrDefault(_config.TopP);

        AzureOpenAIPromptExecutionSettings settings = new() {
            ToolCallBehavior = ToolCallBehavior.AutoInvokeKernelFunctions,
            MaxTokens = maxTokens,
            Temperature = temperature,
            TopP = nucleusSampling,
            PresencePenalty = _config.PresencePenalty,
            FrequencyPenalty = _config.FrequencyPenalty,
            StopSequences = _config.StopSequences,
        };
        var chatCompletionService = kernel.GetRequiredService<IChatCompletionService>();
        var result = await chatCompletionService.GetChatMessageContentAsync(prompt, settings, kernel, token);
        PathwayAnswer answers = new PathwayAnswer();

        try {
            string cleanedContent = Regex.Replace(result.Content!, @"```json[\s\S]*?```", "").Trim();
            answers = JsonConvert.DeserializeObject<PathwayAnswer>(cleanedContent)!;
        } catch (Exception ex) {
            logger.LogError(ex, "Error deserializing the pathway answer.");
            answers.Reason = result.Content!;
        }

        return answers;
    }

    public async Task<FlagAnswer> GenerateAnswer(string prompt, string? imageUrl, IMessageContext? context, CancellationToken token = default) {
        int maxTokens = context.GetCustomRagMaxTokensOrDefault(_config.AnswerTokens);
        double temperature = context.GetCustomRagTemperatureOrDefault(_config.Temperature);
        double nucleusSampling = context.GetCustomRagNucleusSamplingOrDefault(_config.TopP);
        var rootImageUrl = context.GetCustomContentModerationImageUrlOrDefault("");
        AzureOpenAIPromptExecutionSettings settings = new() {
            MaxTokens = maxTokens,
            Temperature = temperature,
            TopP = nucleusSampling,
            PresencePenalty = _config.PresencePenalty,
            FrequencyPenalty = _config.FrequencyPenalty,
            StopSequences = _config.StopSequences,
        };
        var chatCompletionService = kernel.GetRequiredService<IChatCompletionService>();
        var chatHistory = await BuildChatContentModeration(prompt, imageUrl, rootImageUrl);

        var result = chatCompletionService.GetStreamingChatMessageContentsAsync(chatHistory, settings, kernel, token);
        StringBuilder fullMessage = new();
        await foreach (var content in result) {
            fullMessage.Append(content.Content);
        }

        var answers = new FlagAnswer();
        try {
            string cleanedContent = Regex.Replace(fullMessage.ToString(), @"```json[\s\S]*?```", "").Trim();
            answers = JsonConvert.DeserializeObject<FlagAnswer>(cleanedContent)!;
        } catch (Exception ex) {
            logger.LogError(ex, "Error deserializing the flag answer.");
            answers.Reason = fullMessage.ToString();
        }

        return answers;
    }

    private async Task<ChatHistory> GetRecentChatHistory(Guid conversationId) {
        int pastMessages = configuration.GetValue("Parameters:PastMessages", 10);
        ChatHistory chats = new ChatHistory();
        var conversation = await conversationRepository.GetRecentMessagesAsync(conversationId, pastMessages);
        if (conversation == null) {
            return chats;
        }
        conversation.Messages.OrderBy(m => m.CreatedAt)
            .ToList().ForEach(m => {
                if (m.SenderType == SenderType.User) {
                    chats.AddUserMessage(m.Content);
                } else {
                    chats.AddAssistantMessage(m.Content);
                }
            });
        return chats;
    }

    public async Task<ChatHistory> BuildChatContentModeration(string question, string? imageUrl, string rootImageUrl) {
        var messageContent = new ChatMessageContent() {
            Role = AuthorRole.User,
            Items = [new TextContent { Text = question }]
        };
        if (!string.IsNullOrEmpty(imageUrl)) {
            string base64Image = await ImageHelper.ConvertImageUrlToBase64Async(imageUrl);
            byte[] imageData = Convert.FromBase64String(base64Image);
            string mimeType = ImageHelper.GetMimeTypeFromUrl(rootImageUrl);
            var imageContent = new ImageContent(imageData, mimeType);
            messageContent.Items.Add(imageContent);

        }
        ChatHistory chatHistory = [messageContent];
        return chatHistory;
    }
}

