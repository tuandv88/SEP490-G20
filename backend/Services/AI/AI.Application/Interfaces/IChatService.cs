using Newtonsoft.Json;

namespace AI.Application.Interfaces;
public interface IChatService {
    Task<MessageAnswer> GenerateAnswer(Guid conversationId, string prompt, IMessageContext? context = default, CancellationToken token = default);
}

public class MessageAnswer {
    [JsonProperty("answer")]
    public string Answer { get; set; } = default!;

    [JsonProperty("documentIds")]
    public List<string> Documents { get; set; } = new();

    [JsonProperty("externalResources")]
    public List<string> ExternalResources { get; set; } = new();
}