using AI.Domain.Enums;

namespace AI.Application.Interfaces;
public interface IMessageService{
    string BuildPrompt(PromptType promptType, string question, string facts, IMessageContext? context = default);
    string ExtractMessage(PromptType promptType, string message);
}

