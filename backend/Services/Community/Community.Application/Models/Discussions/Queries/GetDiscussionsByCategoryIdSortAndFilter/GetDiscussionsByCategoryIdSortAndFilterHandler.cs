
using Community.Application.Models.Discussions.Dtos;

namespace Community.Application.Models.Discussions.Queries.GetDiscussionsByCategoryIdSortAndFilter;

// Kết quả trả về của Query với dạng PaginatedResult
public record GetDiscussionsByCategoryIdSortAndFilterResult(PaginatedResult<DiscussionDto> DiscussionDtos);

// Query yêu cầu danh sách Discussion theo Category Id với phân trang, sắp xếp và lọc theo tags
public record GetDiscussionsByCategoryIdSortAndFilterQuery(Guid CategoryId, PaginationRequest PaginationRequest, string? OrderBy, string? Tags) : IQuery<GetDiscussionsByCategoryIdSortAndFilterResult>;

// Validator để kiểm tra các giá trị của query
public class GetDiscussionByCateIdValidator : AbstractValidator<GetDiscussionsByCategoryIdSortAndFilterQuery>
{
    public GetDiscussionByCateIdValidator()
    {
        RuleFor(x => x.PaginationRequest.PageIndex)
            .GreaterThanOrEqualTo(1)
            .WithMessage("PageIndex must be greater than or equal to 1.");
        RuleFor(x => x.PaginationRequest.PageSize)
            .LessThanOrEqualTo(15)
            .WithMessage("PageSize must be less than or equal to 15.");
    }
}

