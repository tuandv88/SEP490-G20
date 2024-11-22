using Microsoft.AspNetCore.Authorization;

namespace AI.Application.Models.Conversations.Commands.DeleteConversation;
[Authorize]
public record DeleteConversationCommand(Guid Id): ICommand;
