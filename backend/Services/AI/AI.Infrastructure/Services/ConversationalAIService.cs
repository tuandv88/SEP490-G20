using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.KernelMemory;
using Newtonsoft.Json;

namespace AI.Infrastructure.Services;
public class ConversationalAIService(
    Kernel kernel, SearchClientConfig _config, IConversationRepository conversationRepository, ILogger<ConversationalAIService> logger
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
        };
        var chatCompletionService = kernel.GetRequiredService<IChatCompletionService>();
        var chatHistory = await GetRecentChatHistory(conversationId);

        //Thêm câu hỏi cho user
        chatHistory.AddUserMessage(prompt);
        var result = await chatCompletionService.GetChatMessageContentAsync(chatHistory, settings, kernel, token);

        MessageAnswer messageAnswer = new MessageAnswer();
        try {
            messageAnswer = JsonConvert.DeserializeObject<MessageAnswer>(result.Content!)!;
        } catch (Exception ex) {
            logger.LogError(ex.Message);
            messageAnswer.Answer = result.Content ?? _config.EmptyAnswer;
        }
        return messageAnswer;
    }

    private async Task<ChatHistory> GetRecentChatHistory(Guid conversationId) {
        ChatHistory chats = new ChatHistory(); 
        var conversation = await conversationRepository.GetRecentMessagesAsync(conversationId);
        if(conversation==null) {
            return chats;
        }
        conversation.Messages.ForEach(m => {
            if(m.SenderType == SenderType.User) {
                chats.AddUserMessage(m.Content);
            } else {
                chats.AddAssistantMessage(m.Content);
            }
        });
        return chats;
    }
}

