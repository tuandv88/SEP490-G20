
using Learning.Application.Models.Problems.Dtos;

namespace Learning.Application.Models.Problems.Queries.GetProblems;
public record GetProblemsQuery(PaginationRequest PaginationRequest) : IQuery<GetProblemsResult>;
public record GetProblemsResult(PaginatedResult<ProblemListDto> Problems);

public class GetProblemsQueryValidator : AbstractValidator<GetProblemsQuery> {
    public GetProblemsQueryValidator() {
        RuleFor(x => x.PaginationRequest.PageIndex)
            .GreaterThanOrEqualTo(1)
            .WithMessage("PageIndex must be greater than or equal to 1.");
        RuleFor(x => x.PaginationRequest.PageSize)
            .LessThanOrEqualTo(30)
            .WithMessage("PageSize must be less than or equal to 30.");
    }
}