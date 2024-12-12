using Community.Application.Models.Comments.Dtos;
using Community.Application.Models.Discussions.Dtos;

namespace Community.Application.Models.Discussions.Queries.GetDiscussionDetailById;

public record GetDiscussionDetailByIdResult(DiscussionDetailsDto DiscussionDetailsDto);

public record GetDiscussionDetailByIdQuery(Guid Id) : IQuery<GetDiscussionDetailByIdResult>;
