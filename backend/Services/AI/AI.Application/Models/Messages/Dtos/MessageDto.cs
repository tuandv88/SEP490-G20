namespace AI.Application.Models.Messages.Dtos;
public record MessageDto(
    Guid? ConversationId,
    Guid? LectureId,
    string? SenderType,
    string Content,
    Dictionary<string, string>? ReferenceLink
);
