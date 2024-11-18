using AI.Application.Models.Conversations.Dtos;

namespace AI.Application.Extensions;
public static class ConversationExtensions {
    public static ConversationDto ToConversationDto(this Conversation conversation) {
        return new ConversationDto(
            Id: conversation.Id.Value,
            Title: conversation.Title
            );
    }
}

