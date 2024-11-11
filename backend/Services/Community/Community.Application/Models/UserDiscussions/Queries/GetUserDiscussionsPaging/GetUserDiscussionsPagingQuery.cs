using Community.Application.Models.UserDiscussions.Dtos;

namespace Community.Application.Models.UserDiscussions.Queries.GetUserDiscussionsPaging;
public record GetUserDiscussionsPagingResult(PaginatedResult<UserDiscussionDto> UserDiscussionDtos);

public record GetUserDiscussionsPagingQuery(PaginationRequest PaginationRequest) : IQuery<GetUserDiscussionsPagingResult>;
public class GetUserDiscussionsPagingValidator : AbstractValidator<GetUserDiscussionsPagingQuery>
{
    public GetUserDiscussionsPagingValidator()
    {
        RuleFor(x => x.PaginationRequest.PageIndex)
            .GreaterThanOrEqualTo(1)
            .WithMessage("PageIndex must be greater than or equal to 1.");
        RuleFor(x => x.PaginationRequest.PageSize)
            .LessThanOrEqualTo(15)
            .WithMessage("PageSize must be less than or equal to 15.");
    }
}