using Community.Application.Models.Comments.Dtos;

namespace Community.Application.Models.Comments.Queries.GetCommentsPaging;
public record GetCommentsPagingResult(PaginatedResult<CommentDto> CommentDtos);

public record GetCommentsPagingQuery(PaginationRequest PaginationRequest) : IQuery<GetCommentsPagingResult>;
public class GetCommentsPagingValidator : AbstractValidator<GetCommentsPagingQuery>
{
    public GetCommentsPagingValidator()
    {
        RuleFor(x => x.PaginationRequest.PageIndex)
            .GreaterThanOrEqualTo(1)
            .WithMessage("PageIndex must be greater than or equal to 1.");
        RuleFor(x => x.PaginationRequest.PageSize)
            .LessThanOrEqualTo(15)
            .WithMessage("PageSize must be less than or equal to 15.");
    }
}
