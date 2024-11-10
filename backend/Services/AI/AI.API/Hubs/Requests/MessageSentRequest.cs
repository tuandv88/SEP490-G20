using AI.Application.Models.Messages.Dtos;

namespace AI.API.Hubs.Requests;
public record MessageSentRequest(
    MessageSendDto Message
);
