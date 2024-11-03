using Community.Application.Models.Categories.Dtos;
using Community.Application.Models.Discussions.Dtos;

namespace Community.Application.Models.Discussions.Queries.GetDiscussionById;

public record GetDiscussionByIdResult(DiscussionDto DiscussionDto);

public record GetDiscussionByIdQuery(Guid Id) : IQuery<GetDiscussionByIdResult>;



