using Newtonsoft.Json;
using System.ComponentModel;

namespace AI.Application.Interfaces;
public interface IChatService {
    Task<MessageAnswer> GenerateAnswer(Guid conversationId, string prompt, IMessageContext? context = default, CancellationToken token = default);
    Task<List<PathwayAnswer>> GenerateAnswer(string prompt, IMessageContext? context, CancellationToken token = default);
}

public class MessageAnswer {
    [JsonProperty("answer")]
    [Description("The content of the answer provided by AI")]
    public string Answer { get; set; } = string.Empty;

    [JsonProperty("documentIds")]
    [Description("List of document IDs from facts that are relevant to the answer")]
    public List<string> DocumentIds { get; set; } = new();

    [JsonProperty("externalResources")]
    [Description("List of external resources in Markdown format [Text](Url) that are relevant to the answer")]
    public List<string> ExternalResources { get; set; } = new();
}
public class PathwayAnswer {
    public string PathwayName { get; set; } = string.Empty;
    public List<Guid> CourseIds { get; set; } = new();
    public string Reason { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime DateTime { get; set; }
}