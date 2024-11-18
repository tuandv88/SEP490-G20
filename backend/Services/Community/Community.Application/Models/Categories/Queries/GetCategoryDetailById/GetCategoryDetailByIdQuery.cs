using Community.Application.Models.Categories.Dtos;

namespace Community.Application.Models.Categories.Queries.GetCategoryDetailById;

public record GetCategoryDetailByIdResult(PaginatedResult<CategoryDetailDto> CategoryDetailDto);
public record GetCategoryDetailByIdQuery(Guid CategoryId, PaginationRequest PaginationRequest, string? OrderBy, string? Tags) : IQuery<GetCategoryDetailByIdResult>;

public class GetCategoryDetailByIdValidator : AbstractValidator<GetCategoryDetailByIdQuery>
{
    public GetCategoryDetailByIdValidator()
    {
        RuleFor(x => x.PaginationRequest.PageIndex)
            .GreaterThanOrEqualTo(1)
            .WithMessage("PageIndex must be greater than or equal to 1.");
        RuleFor(x => x.PaginationRequest.PageSize)
            .LessThanOrEqualTo(15)
            .WithMessage("PageSize must be less than or equal to 15.");
    }
}
