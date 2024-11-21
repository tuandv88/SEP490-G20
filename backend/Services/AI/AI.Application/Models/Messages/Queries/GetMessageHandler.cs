using AI.Application.Extensions;
using AI.Application.Models.Messages.Dtos;
using BuildingBlocks.Pagination;
using MassTransit.Initializers;

namespace AI.Application.Models.Messages.Queries;
public class GetMessageHandler(IMessageRepository messageRepository, IConversationRepository conversationRepository,
    IUserContextService userContext, IDocumentService documentService
    ) : IQueryHandler<GetMessagesQuery, GetMessagesResult> {
    public async Task<GetMessagesResult> Handle(GetMessagesQuery query, CancellationToken cancellationToken) {
        var userId = userContext.User.Id;

        var exist = await conversationRepository.IsConversationOwnedByUserAsync(userId, query.ConversationId);
        if(exist==false) {
            throw new NotFoundException(nameof(Conversation), query.ConversationId);
        }
        var allData = await messageRepository.GetMessageByConversationIdsync(query.ConversationId);

        //Phân trang
        var pageIndex = query.PaginationRequest.PageIndex;
        var pageSize = query.PaginationRequest.PageSize;

        var totalCount = allData.Count();
        var messages = allData.OrderByDescending(c => c.CreatedAt)
                            .Skip(pageSize * (pageIndex - 1))
                            .Take(pageSize)
                            .ToList();

        var messageDto = messages.Select(m => {
            var references = documentService.GetDocumentMarkdownLinks(m.References!).Result;
            var referenceLinks = new List<string>();
            referenceLinks.AddRange(references);
            referenceLinks.AddRange(m.NonIndexedExternalReferences!);
            return m.ToMessageDto(referenceLinks);
        }).ToList();

         return new GetMessagesResult(
            new PaginatedResult<MessageDto>(pageIndex, pageSize, totalCount, messageDto));
    }
}

