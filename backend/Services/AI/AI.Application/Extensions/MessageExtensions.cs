using AI.Application.Models.Messages.Dtos;

namespace AI.Application.Extensions;
public static class MessageExtensions {
    public static MessageDto ToMessageDto(this Message message, List<string> referenceLinks) {
        return new MessageDto(
            Id: message.Id.Value,
            ConversationId: message.ConversationId.Value,
            SenderType: message.SenderType.ToString(),
            Content: message.Content,
            ReferenceLinks: referenceLinks
            );
    }
}

