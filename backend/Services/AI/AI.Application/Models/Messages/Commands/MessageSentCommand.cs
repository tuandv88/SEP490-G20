using AI.Application.Models.Messages.Dtos;

namespace AI.Application.Models.Messages.Commands;
public record MessageSentCommand(MessageSendDto MessageSend) : ICommand<MessageSentResult>;
public record MessageSentResult(MessageAnswerDto MessageAnswer);
