using DocumentFormat.OpenXml.Office2021.DocumentTasks;
using Newtonsoft.Json;
using System.ComponentModel;

namespace AI.Application.Interfaces;
public interface IChatService {
    Task<MessageAnswer> GenerateAnswer(Guid conversationId, string prompt, IMessageContext? context = default, CancellationToken token = default);
    Task<PathwayAnswer> GenerateAnswer(string prompt, IMessageContext? context, CancellationToken token = default);
    Task<FlagAnswer> GenerateAnswer(string prompt, string? imageUrl, IMessageContext? context, CancellationToken token = default);
}

public class MessageAnswer {
    [JsonProperty("answer")]
    [Description("The content of the answer provided by AI")]
    public string Answer { get; set; } = string.Empty;

    [JsonProperty("documentIds")]
    [Description("List of document IDs from facts that are relevant to the answer")]
    public List<string> DocumentIds { get; set; } = [];

    [JsonProperty("externalResources")]
    [Description("List of external resources in Markdown format [Text](Url) that are relevant to the answer")]
    public List<string> ExternalResources { get; set; } = [];
}
public class PathwayAnswer {
    public string PathwayName { get; set; } = string.Empty;
    public List<PathStepAnswer> PathSteps { get; set; } = [];
    public string Reason { get; set; } = string.Empty;
    public TimeSpan EstimatedCompletionTime { get; set; }
}
public class PathStepAnswer {
    public Guid CourseId { get; set; }
    public TimeSpan EstimatedCompletionTime { get; set; }
}
public class FlagAnswer {
    public string ViolationLevel { get; set; } = string.Empty; //None, Low, Medium, High
    public string Reason { get; set; } = string.Empty;
}