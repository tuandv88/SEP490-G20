namespace AI.Application.Interfaces;
public interface IChatService {
    Task<string> GenerateAnswer(ChatHistory chatHistory, CancellationToken token);
}

