using Community.Application.Models.UserDiscussions.Dtos;

namespace Community.Application.Models.UserDiscussions.Queries.GetUserDiscussionById;

public record GetUserDiscussionByIdResult(UserDiscussionDto UserDiscussionDto);

public record GetUserDiscussionByIdQuery(Guid Id) : IQuery<GetUserDiscussionByIdResult>;