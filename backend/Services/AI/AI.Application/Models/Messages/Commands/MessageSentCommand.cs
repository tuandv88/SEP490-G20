using AI.Application.Models.Messages.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace AI.Application.Models.Messages.Commands;
[Authorize]
public record MessageSentCommand(string connectionId, MessageSendDto MessageSend) : ICommand<MessageSentResult>;
public record MessageSentResult(MessageAnswerDto MessageAnswer);
