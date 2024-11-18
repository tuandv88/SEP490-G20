using AI.Application.Models.Messages.Dtos;

namespace AI.Application.Models.Messages.Commands;
public record MessageSentCommand(string connectionId, MessageSendDto MessageSend) : ICommand<MessageSentResult>;
public record MessageSentResult(MessageAnswerDto MessageAnswer);
