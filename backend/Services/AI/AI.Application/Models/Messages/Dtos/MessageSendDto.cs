namespace AI.Application.Models.Messages.Dtos;
public record MessageSendDto(
    Guid? ConversationId,
    Guid? LectureId,
    Guid? ProblemId,
    string Content
);

