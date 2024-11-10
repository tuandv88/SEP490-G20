using Newtonsoft.Json;
using System.ComponentModel;

namespace AI.Application.Interfaces;
public interface IChatService {
    Task<MessageAnswer> GenerateAnswer(Guid conversationId, string prompt, IMessageContext? context = default, CancellationToken token = default);
}

public class MessageAnswer {
    [JsonProperty("answer")]
    public string Answer { get; set; } = default!;

    [JsonProperty("documentIds"), Description("List of document IDs from facts that are relevant to the answer")]
    public List<string> DocumentIds { get; set; } = new();

    [JsonProperty("externalResources"), Description("List of external resources in Markdown format [Text](Url) that are relevant to the answer")]
    public List<string> ExternalResources { get; set; } = new();
}