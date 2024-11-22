using AI.Application.Models.Messages.Dtos;
using BuildingBlocks.Pagination;
using Microsoft.AspNetCore.Authorization;

namespace AI.Application.Models.Messages.Queries;
[Authorize]
public record GetMessagesQuery(Guid ConversationId, PaginationRequest PaginationRequest) : IQuery<GetMessagesResult>;
public record GetMessagesResult(PaginatedResult<MessageDto> Messages);

