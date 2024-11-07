using AI.Application.Models.Messages.Dtos;

namespace AI.Application.Models.Messages.Commands;
public class MessageSentHandler(IMessageRepository messageRepository, IConversationRepository conversationRepository, 
    IUserContextService userContext, IPublisher publisher) : ICommandHandler<MessageSentCommand, MessageSentResult> {
    public async Task<MessageSentResult> Handle(MessageSentCommand request, CancellationToken cancellationToken) {
        var userId = userContext.User.Id;
        Conversation? conversation = null;
        if (request.MessageSend.ConversationId.HasValue) {
            conversation = await conversationRepository.GetByIdAsync(request.MessageSend.ConversationId.Value);
            if(conversation == null) {
                throw new NotFoundException("Conversation", request.MessageSend.ConversationId);
            }
        } else {
            conversation = CreateNewConversation(userId, request.MessageSend);
        }


        //_ = Task.Run(() => publisher.Publish(new MessageReceivedEvent(request.MessageSend), cancellationToken));
        //return new MessageSentResult();
        throw new NotImplementedException();
    }

    private Conversation CreateNewConversation(Guid? uid, MessageSendDto message) {
        throw new NotImplementedException();
        
        //var conversation = Conversation.Create()
    }
}

