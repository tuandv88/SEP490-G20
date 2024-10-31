using BuildingBlocks.Pagination;
using Community.Application.Models.Discussions.Dtos;

namespace Community.Application.Models.Discussions.Queries.GetDiscussionByCategoryId;

// Query yêu cầu danh sách Discussion theo Category Id với phân trang
public record GetDiscussionByCateIdQuery(Guid CategoryId, PaginationRequest PaginationRequest) : IQuery<GetDiscussionByCateIdResult>;

// Kết quả trả về của Query với dạng PaginatedResult
public record GetDiscussionByCateIdResult(PaginatedResult<DiscussionDto> DiscussionDtos);

// Validator để kiểm tra các giá trị của query
public class GetDiscussionByCateIdValidator : AbstractValidator<GetDiscussionByCateIdQuery>
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
