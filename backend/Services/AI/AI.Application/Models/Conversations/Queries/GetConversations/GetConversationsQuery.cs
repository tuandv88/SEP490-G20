using AI.Application.Models.Conversations.Dtos;
using BuildingBlocks.Pagination;
using Microsoft.AspNetCore.Authorization;

namespace AI.Application.Models.Conversations.Queries.GetConversations;
[Authorize]
public record GetConversationsQuery(PaginationRequest PaginationRequest) : IQuery<GetConversationsResult>;
public record GetConversationsResult(PaginatedResult<ConversationDto> Conversations);