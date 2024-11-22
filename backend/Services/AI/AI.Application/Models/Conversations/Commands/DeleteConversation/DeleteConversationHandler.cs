
using AI.Domain.ValueObjects;

namespace AI.Application.Models.Conversations.Commands.DeleteConversation;
public class DeleteConversationHandler(IConversationRepository repository, IUserContextService userContext) : ICommandHandler<DeleteConversationCommand, Unit> {
    public async Task<Unit> Handle(DeleteConversationCommand request, CancellationToken cancellationToken) {
        var userId = userContext.User.Id;
        var conversation = await repository.GetByIdAsync(request.Id);

        if(conversation == null) {
            throw new NotFoundException(nameof(Conversation), request.Id);
        }
        if(!conversation.UserId.Equals(UserId.Of(userId))) {
            throw new ForbiddenAccessException();
        }

        await repository.DeleteAsync(conversation);
        await repository.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

