using AI.Application.Interfaces;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.Connectors.AzureOpenAI;
using Microsoft.SemanticKernel.Connectors.OpenAI;

namespace AI.Infrastructure.Services;
public class ConversationalAIService(Kernel kernel) : IChatService {
    public async Task<string> GenerateAnswer(ChatHistory chatHistory, CancellationToken token) {

        AzureOpenAIPromptExecutionSettings settings = new() {
            ToolCallBehavior = ToolCallBehavior.AutoInvokeKernelFunctions,
        };
        var chatCompletionService = kernel.GetRequiredService<IChatCompletionService>();

        var result = await chatCompletionService.GetChatMessageContentAsync(chatHistory, settings, kernel, token);
        return result.Content!;
    }
}

