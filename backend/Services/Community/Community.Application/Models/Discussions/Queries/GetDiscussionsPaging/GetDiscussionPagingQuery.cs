using Community.Application.Models.Discussions.Dtos;

namespace Community.Application.Models.Discussions.Queries.GetDiscussionsPaging;
public record GetDiscussionsPagingResult(PaginatedResult<DiscussionDto> DiscussionDtos);

public record GetDiscussionsPagingQuery(PaginationRequest PaginationRequest) : IQuery<GetDiscussionsPagingResult>;
public class GetDiscussionsPagingValidator : AbstractValidator<GetDiscussionsPagingQuery>
{
    public GetDiscussionsPagingValidator()
    {
        RuleFor(x => x.PaginationRequest.PageIndex)
            .GreaterThanOrEqualTo(1)
            .WithMessage("PageIndex must be greater than or equal to 1.");
        RuleFor(x => x.PaginationRequest.PageSize)
            .LessThanOrEqualTo(15)
            .WithMessage("PageSize must be less than or equal to 15.");
    }
}
