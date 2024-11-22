using AI.Application.Extensions;
using AI.Application.Models.Conversations.Dtos;
using BuildingBlocks.Pagination;

namespace AI.Application.Models.Conversations.Queries.GetConversations;
public class GetConversationsHandler(IUserContextService userContext, IConversationRepository repository) : IQueryHandler<GetConversationsQuery, GetConversationsResult> {
    public async Task<GetConversationsResult> Handle(GetConversationsQuery query, CancellationToken cancellationToken) {
        var userId = userContext.User.Id;

        var allData = await repository.GetConversationByUserIdAsync(userId);
        //Phân trang
        var pageIndex = query.PaginationRequest.PageIndex;
        var pageSize = query.PaginationRequest.PageSize;
        
        var totalCount = allData.Count();
        var conversations = allData.OrderByDescending(c => c.LastModified)
                            .Skip(pageSize * (pageIndex - 1))
                            .Take(pageSize)
                            .ToList();

        var conversationDtos = conversations.Select(c => c.ToConversationDto()).ToList();
        return new GetConversationsResult(
            new PaginatedResult<ConversationDto>(pageIndex, pageSize, totalCount, conversationDtos));
    }
}

