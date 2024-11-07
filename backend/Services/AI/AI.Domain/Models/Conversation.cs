using AI.Domain.Abstractions;
using AI.Domain.ValueObjects;

namespace AI.Domain.Models;
public class Conversation : Aggregate<ConversationId> {
    public UserId UserId { get; set; } = default!;
    public string Title { get; set; } = default!;
    public Dictionary<string, object> Context { get; set; } = new Dictionary<string, object>();
    public List<Message> Messages { get; set; } = new List<Message>();

    public static Conversation Create(UserId userId, string title, Dictionary<string, object> context, List<Message> messages) {
        var conversation = new Conversation() {
            UserId = userId,
            Title = title,
            Context = context,
            Messages = messages
        };
        //TODO add event
        return conversation;
    }
    public void AddMessage(Message message) {
        Messages.Add(message);
    }
}

