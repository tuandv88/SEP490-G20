using Community.Application.Models.Categories.Dtos;
using Community.Application.Models.Discussions.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Community.Application.Models.Discussions.Queries.GetDiscussions;

public record GetDiscussionsResult(List<DiscussionDto> DiscussionDtos);
[Authorize]
public record GetDiscussionsQuery : IQuery<GetDiscussionsResult>;



