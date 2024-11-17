using Community.Application.Models.Votes.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community.Application.Models.Votes.Queries.GetVotesByIdComment;

public record GetVotesByIdCommentResult(PaginatedResult<VoteDto> VoteDtos);
public record GetVotesByIdCommentQuery(Guid CommentId, PaginationRequest PaginationRequest) : IQuery<GetVotesByIdCommentResult>;
public class GetVotesByIdCommentValidator : AbstractValidator<GetVotesByIdCommentQuery>
{
    public GetVotesByIdCommentValidator()
    {
        RuleFor(x => x.CommentId).NotEmpty().WithMessage("CommentId cannot be empty.");
        RuleFor(x => x.PaginationRequest.PageIndex)
            .GreaterThanOrEqualTo(1)
            .WithMessage("PageIndex must be greater than or equal to 1.");
        RuleFor(x => x.PaginationRequest.PageSize)
            .LessThanOrEqualTo(15)
            .WithMessage("PageSize must be less than or equal to 15.");
    }
}
