
namespace AI.Application.Models.Conversations.Commands.DeleteConversation;
public class DeleteConversationHandler(IConversationRepository repository) : ICommandHandler<DeleteConversationCommand, Unit> {
    public async Task<Unit> Handle(DeleteConversationCommand request, CancellationToken cancellationToken) {
        await repository.DeleteByIdAsync(request.Id);
        await repository.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

