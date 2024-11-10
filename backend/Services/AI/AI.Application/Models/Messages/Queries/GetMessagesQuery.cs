using AI.Application.Models.Messages.Dtos;
using BuildingBlocks.Pagination;

namespace AI.Application.Models.Messages.Queries;
public record GetMessagesQuery(Guid ConversationId, PaginationRequest PaginationRequest) : IQuery<GetMessagesResult>;
public record GetMessagesResult(PaginatedResult<MessageDto> Messages);

