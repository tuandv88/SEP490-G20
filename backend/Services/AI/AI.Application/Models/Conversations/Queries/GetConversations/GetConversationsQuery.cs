using AI.Application.Models.Conversations.Dtos;
using BuildingBlocks.Pagination;

namespace AI.Application.Models.Conversations.Queries.GetConversations;
public record GetConversationsQuery(PaginationRequest PaginationRequest) : IQuery<GetConversationsResult>;
public record GetConversationsResult(PaginatedResult<ConversationDto> Conversations);