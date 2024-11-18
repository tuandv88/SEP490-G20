using AI.Application.Common.Constants;
using AI.Application.Models.Messages.Dtos;
using AI.Domain.Enums;
using AI.Domain.ValueObjects;
using Microsoft.Extensions.Configuration;
using Microsoft.KernelMemory;

namespace AI.Application.Models.Messages.Commands;
public class MessageSentHandler(
    IMessageRepository messageRepository, IConversationRepository conversationRepository,
    IUserContextService userContext, IChatService chatService, IMessageService messageService,
    IDocumentRepository documentRepository,IKernelMemory memory, IDocumentService documentService,
    IConfiguration configuration
    ) : ICommandHandler<MessageSentCommand, MessageSentResult> {
    public async Task<MessageSentResult> Handle(MessageSentCommand request, CancellationToken cancellationToken) {
        var userId = Guid.Parse("89980ac8-3d50-49af-9a65-9cdcda802e11"); //userContext.User.Id;
        if (userId == null) {
            throw new UnauthorizedAccessException();
        }
        Conversation? conversation = null;

        //Tạo context
        var context = new MessageContext(new Dictionary<string, object?>() {
            {ContextConstant.Learning.LectureId, request.MessageSend.LectureId.ToString()},
            {ContextConstant.Learning.ProblemId, request.MessageSend.ProblemId.ToString()},
            {ContextConstant.Community.ConnectionId, request.connectionId.ToString()}
        });
        //chỉ định promptType
        var promptType = PromptType.AnswerWithFacts;

        if (request.MessageSend.ConversationId.HasValue) {
            conversation = await conversationRepository.GetByIdAsync(request.MessageSend.ConversationId.Value);
            if (conversation == null) {
                throw new NotFoundException("Conversation", request.MessageSend.ConversationId);
            }
        } else {
            conversation = CreateNewConversation(userId, request.MessageSend, context.Arguments!, promptType);
            //Lưu lại conversation
            await conversationRepository.AddAsync(conversation);
            await conversationRepository.SaveChangesAsync(cancellationToken);
        }

        var minRelevance = configuration.GetValue("SearchClient:MinRelevance", 0.4);
        //lấy ra thông tin liên quan 
        var facts = await memory.AskAsync(request.MessageSend.Content, minRelevance: minRelevance);

        var prompt = messageService.BuildPrompt(promptType, request.MessageSend.Content, facts.Result, context);

        var answer = await chatService.GenerateAnswer(conversation.Id.Value, prompt, context);

        //Lưu lại câu hỏi trước đó người dùng hỏi
        var messageFromUser = CreateNewMessageFromUser(conversation, request.MessageSend.Content, promptType, context.Arguments!);

        //Lưu lại message trước khi trả kết quả về
        var messageFromAI = await CreateNewMessageFromAI(conversation, answer, promptType, context.Arguments!);

        await messageRepository.AddAsync(messageFromUser);
        await messageRepository.AddAsync(messageFromAI);
        await messageRepository.SaveChangesAsync(cancellationToken);

        //Lấy ra reference link
        var referenceLink = new List<string>();
        referenceLink.AddRange(answer.ExternalResources);
        referenceLink.AddRange(await documentService.GetDocumentMarkdownLinks(answer.DocumentIds, facts));

        return new MessageSentResult(
            new MessageAnswerDto(
                Id: messageFromAI.Id.Value,
                ConversationId: conversation.Id.Value,
                SenderType: SenderType.AI.ToString(),
                Content: answer.Answer,
                ReferenceLinks: referenceLink
            ));
    }

    private Conversation CreateNewConversation(Guid uid, MessageSendDto messageSend, IDictionary<string, object> context, PromptType promptType) {
        string title = string.Join(" ", messageSend.Content.Split(' ').Take(10));

        if (title.Length > 40) {
            title = title.Substring(0, 40) + "...";
        }
        var conversation = Conversation.Create(
            conversationId: ConversationId.Of(Guid.NewGuid()),
            userId: UserId.Of(uid),
            title: title
            );
        return conversation;
    }
    private Message CreateNewMessageFromUser(Conversation conversation, string content,
        PromptType promptType, IDictionary<string, object> context) {
        var message = new Message() {
            Id = MessageId.Of(Guid.NewGuid()),
            ConversationId = conversation.Id,
            SenderType = SenderType.User,
            Content = content,
            PromptType = promptType,
            Context = (Dictionary<string, object>)context,
        };
        conversation.AddMessage(message);
        return message;
    }
    private async Task<Message> CreateNewMessageFromAI(Conversation conversation, MessageAnswer messageAnswer, 
        PromptType promptType, IDictionary<string, object> context) {
        var document = await documentRepository.GetDocuments(messageAnswer.DocumentIds.Select(Guid.Parse).ToArray());
        var message = new Message() {
            Id = MessageId.Of(Guid.NewGuid()),
            ConversationId = conversation.Id,
            SenderType = SenderType.AI,
            Content = messageAnswer.Answer,
            PromptType = promptType,
            References = document,
            NonIndexedExternalReferences = messageAnswer.ExternalResources,
            Context = (Dictionary<string, object>)context,
        };
        conversation.AddMessage(message);
        return message;
    }

}

