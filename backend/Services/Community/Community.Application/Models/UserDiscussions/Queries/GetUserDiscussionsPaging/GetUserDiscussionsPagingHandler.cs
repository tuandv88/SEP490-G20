using Community.Application.Models.Discussions.Dtos;
using Community.Application.Models.UserDiscussions.Dtos;
using Community.Application.Models.UserDiscussions.Queries.GetUserDiscussionsPaging;
using Community.Application.Extensions;
using Community.Domain.Models;

namespace Community.Application.Models.UserDiscussions.Queries.GetUserDiscussionsPaging;

public class GetUserDiscussionsPagingHandler : IQueryHandler<GetUserDiscussionsPagingQuery, GetUserDiscussionsPagingResult>
{
    private readonly IUserDiscussionRepository _repository;

    public GetUserDiscussionsPagingHandler(IUserDiscussionRepository repository)
    {
        _repository = repository;
    }

    public async Task<GetUserDiscussionsPagingResult> Handle(GetUserDiscussionsPagingQuery query, CancellationToken cancellationToken)
    {
        var allData = await _repository.GetAllAsync();

        // Lấy thông tin phân trang
        var pageIndex = query.PaginationRequest.PageIndex;
        var pageSize = query.PaginationRequest.PageSize;

        var totalCount = allData.Count();

        var userDiscussions = allData
            .Skip(pageSize * (pageIndex - 1))
            .Take(pageSize)
            .ToList();

        // Sử dụng ToUserDiscussionDtoListAsync để chuyển đổi danh sách UserDiscussion sang DTO
        var userDiscussionDtos = await userDiscussions.ToUserDiscussionDtoListAsync();

        // Tạo đối tượng PaginatedResult với dữ liệu phân trang
        var discussionPaginateData = new PaginatedResult<UserDiscussionDto>(
            pageIndex,
            pageSize,
            totalCount,
            userDiscussionDtos
        );

        return new GetUserDiscussionsPagingResult(discussionPaginateData);
    }
}
