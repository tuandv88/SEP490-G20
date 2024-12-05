using Community.Application.Models.Discussions.Dtos;

namespace Community.Application.Models.Discussions.Queries.GetDiscussionsAll;
public record GetDiscussionsAllResult(PaginatedResult<DiscussionDetailUserDto> DiscussionDetailUserDtos);

[Authorize($"{PoliciesType.Administrator}")]
public record GetDiscussionsAllQuery(PaginationRequest PaginationRequest, string? SearchKeyword, string? Tags) : IQuery<GetDiscussionsAllResult>;
public class GetDiscussionsAllValidator : AbstractValidator<GetDiscussionsAllQuery>
{
    public GetDiscussionsAllValidator()
    {
        RuleFor(x => x.PaginationRequest.PageIndex)
            .GreaterThanOrEqualTo(1)
            .WithMessage("PageIndex must be greater than or equal to 1.");
        RuleFor(x => x.PaginationRequest.PageSize)
            .LessThanOrEqualTo(15)
            .WithMessage("PageSize must be less than or equal to 15.");
    }
}

