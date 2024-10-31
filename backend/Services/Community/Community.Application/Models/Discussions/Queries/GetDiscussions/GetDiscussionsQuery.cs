using Community.Application.Models.Categories.Dtos;
using Community.Application.Models.Discussions.Dtos;

namespace Community.Application.Models.Discussions.Queries.GetDiscussions;

public record GetDiscussionsResult(List<DiscussionDto> DiscussionDtos);

public record GetDiscussionsQuery : IQuery<GetDiscussionsResult>;



