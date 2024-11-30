using Community.Application.Models.Comments.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community.Application.Models.Comments.Queries.GetCommentsByIdCommentParent;

public record GetCommentsByIdCommentParentResult(PaginatedResult<CommentsDetailDto> CommentsDetailDtos);
public record GetCommentsByIdCommentParentQuery(Guid DiscussionId, Guid CommentParentId, PaginationRequest PaginationRequest) : IQuery<GetCommentsByIdCommentParentResult>;
public class GetCommentsByIdCommentParentValidator : AbstractValidator<GetCommentsByIdCommentParentQuery>
{
    public GetCommentsByIdCommentParentValidator()
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

