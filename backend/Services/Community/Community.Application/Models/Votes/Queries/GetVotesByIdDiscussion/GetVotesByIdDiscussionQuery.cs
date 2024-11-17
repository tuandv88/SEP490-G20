using Community.Application.Models.Comments.Dtos;
using Community.Application.Models.Votes.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community.Application.Models.Votes.Queries.GetVoteByIdDiscussion;
public record GetVotesByIdDiscussionResult(PaginatedResult<VoteDto> VoteDtos);
public record GetVotesByIdDiscussionQuery(Guid DiscussionId, PaginationRequest PaginationRequest) : IQuery<GetVotesByIdDiscussionResult>;
public class GetVotesByIdDiscussionValidator : AbstractValidator<GetVotesByIdDiscussionQuery>
{
    public GetVotesByIdDiscussionValidator()
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

