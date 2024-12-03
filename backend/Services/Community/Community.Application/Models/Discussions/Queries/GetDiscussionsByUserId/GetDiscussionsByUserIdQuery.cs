using Community.Application.Models.Discussions.Dtos;

namespace Community.Application.Models.Discussions.Queries.GetDiscussionsByUserId;
public record GetDiscussionsByUserIdResult(PaginatedResult<DiscussionDetailUserDto> DiscussionDetailUserDtos);
[Authorize]
public record GetDiscussionsByUserIdQuery(PaginationRequest PaginationRequest, string? SearchKeyword, string? Tags) : IQuery<GetDiscussionsByUserIdResult>;
public class GetDiscussionsByUserIdValidator : AbstractValidator<GetDiscussionsByUserIdQuery>
{
    public GetDiscussionsByUserIdValidator()
    {
        RuleFor(x => x.PaginationRequest.PageIndex)
            .GreaterThanOrEqualTo(1)
            .WithMessage("PageIndex must be greater than or equal to 1.");
        RuleFor(x => x.PaginationRequest.PageSize)
            .LessThanOrEqualTo(15)
            .WithMessage("PageSize must be less than or equal to 15.");
    }
}
