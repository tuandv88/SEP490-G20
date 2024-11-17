using Community.Application.Models.Comments.Dtos;
using Community.Application.Models.Comments.Queries.GetCommentsPaging;

namespace Community.Application.Models.Comments.Queries.GetCommentsByIdDiscussion;
public record GetCommentsByIdDiscussionResult(PaginatedResult<CommentDto> CommentDtos);
public record GetCommentsByIdDiscussionQuery(Guid DiscussionId, PaginationRequest PaginationRequest) : IQuery<GetCommentsByIdDiscussionResult>;
public class GetCommentsByIdDiscussionValidator : AbstractValidator<GetCommentsByIdDiscussionQuery>
{
    public GetCommentsByIdDiscussionValidator()
    {
        RuleFor(x => x.DiscussionId).NotEmpty().WithMessage("DiscussionId cannot be empty.");
        RuleFor(x => x.PaginationRequest.PageIndex)
            .GreaterThanOrEqualTo(1)
            .WithMessage("PageIndex must be greater than or equal to 1.");
        RuleFor(x => x.PaginationRequest.PageSize)
            .LessThanOrEqualTo(15)
            .WithMessage("PageSize must be less than or equal to 15.");
    }
}

