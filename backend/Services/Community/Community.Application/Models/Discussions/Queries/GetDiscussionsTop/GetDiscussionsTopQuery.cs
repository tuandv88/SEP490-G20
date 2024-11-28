using Community.Application.Models.Discussions.Dtos;

namespace Community.Application.Models.Discussions.Queries.GetDiscussionsTop;

public record GetDiscussionsTopResult(List<DiscussionsTopDto> DiscussionsTopDtos);
public record GetDiscussionsTopQuery : IQuery<GetDiscussionsTopResult>;
