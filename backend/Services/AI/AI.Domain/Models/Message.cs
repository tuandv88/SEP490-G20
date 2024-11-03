using AI.Domain.Abstractions;
using AI.Domain.Enums;
using AI.Domain.ValueObjects;

namespace AI.Domain.Models;
public class Message : Entity<MessageId> {
    public ConversationId ConversationId { get; set; } = default!;
    public SenderType SenderType { get; set; } = SenderType.User;
    public string Content { get; set; } = default!;
    public PromptType PromptType { get; set; } = PromptType.AnswerWithFacts;
    public List<Document>? References { get; set; } = new();
}

