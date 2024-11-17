using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.KernelMemory;
using Newtonsoft.Json;
using System.Text;
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

    private async Task<ChatHistory> GetRecentChatHistory(Guid conversationId) {
        int pastMessages = configuration.GetValue("Parameters:PastMessages", 10);
        ChatHistory chats = new ChatHistory(); 
        var conversation = await conversationRepository.GetRecentMessagesAsync(conversationId, pastMessages);
        if(conversation==null) {
            return chats;
        }
        conversation.Messages.OrderBy(m => m.CreatedAt)
            .ToList().ForEach(m => {
            if(m.SenderType == SenderType.User) {
                chats.AddUserMessage(m.Content);
            } else {
                chats.AddAssistantMessage(m.Content);
            }
        });
        return chats;
    }
}

