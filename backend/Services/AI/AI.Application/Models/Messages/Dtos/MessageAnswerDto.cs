namespace AI.Application.Models.Messages.Dtos;
public record MessageAnswerDto(
    Guid ConversationId,
    string SenderType,
    string Content,
    Dictionary<string, string>? ReferenceLink
);

