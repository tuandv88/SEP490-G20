using Community.Application.Models.Discussions.Dtos;
using Community.Application.Extensions; // Đảm bảo thêm namespace này

namespace Community.Application.Models.Discussions.Queries.GetDiscussionByCategoryId;

public class GetDiscussionByCateIdHandler : IQueryHandler<GetDiscussionByCateIdQuery, GetDiscussionByCateIdResult>
{
    private readonly IDiscussionRepository _repository;

    public GetDiscussionByCateIdHandler(IDiscussionRepository repository)
    {
        _repository = repository;
    }

    public async Task<GetDiscussionByCateIdResult> Handle(GetDiscussionByCateIdQuery query, CancellationToken cancellationToken)
    {
        var allData = await _repository.GetByCategoryIdAsync(query.CategoryId);

        // Lấy thông tin phân trang
        var pageIndex = query.PaginationRequest.PageIndex;
        var pageSize = query.PaginationRequest.PageSize;

        var totalCount = allData.Count();

        var discussions = allData.OrderBy(c => c.DateCreated)
                            .Skip(pageSize * (pageIndex - 1))
                            .Take(pageSize)
                            .ToList();

        // Sử dụng ToDiscussionDtoListAsync để chuyển đổi sang DTO
        var discussionDtos = await discussions.ToDiscussionDtoListAsync();

        var discussionPaginateData = new PaginatedResult<DiscussionDto>(pageIndex, pageSize, totalCount, discussionDtos);

        return new GetDiscussionByCateIdResult(discussionPaginateData);
    }
}
