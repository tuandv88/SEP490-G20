namespace AI.Application.Models.Messages.Dtos;
public record MessageAnswerDto(
    Guid Id,
    Guid ConversationId,
    string SenderType,
    string Content,
    List<string> ReferenceLinks
);

