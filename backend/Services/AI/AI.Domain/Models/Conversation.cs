using AI.Domain.Abstractions;
using AI.Domain.ValueObjects;

namespace AI.Domain.Models;
public class Conversation : Aggregate<ConversationId> {
    public UserId UserId { get; set; } = default!;
    public string Title { get; set; } = default!;
    public List<Message> Messages { get; set; } = new List<Message>();

    public static Conversation Create(ConversationId conversationId, UserId userId, string title) {
        var conversation = new Conversation() {
            Id = conversationId,
            UserId = userId,
            Title = title
        };
        //TODO add event
        return conversation;
    }
    public void AddMessage(Message message) {
        Messages.Add(message);
        //Cập nhật lại thời gian đoạn hội thoại
        LastModified = DateTime.UtcNow;
        LastModifiedBy = message.SenderType.ToString();
    }
}

