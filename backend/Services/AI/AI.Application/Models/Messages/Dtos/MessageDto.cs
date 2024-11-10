namespace AI.Application.Models.Messages.Dtos;
public record MessageDto(
    Guid Id,
    Guid ConversationId,
    string SenderType,
    string Content,
    List<string> ReferenceLinks
);