using Community.Application.Extensions;
using Community.Application.Models.Discussions.Dtos;
using Community.Application.Models.Discussions.Queries.GetDiscussionsByCategoryIdSortAndFilter;

namespace Community.Application.Models.Discussions.Queries.GetDiscussionsByCategoryIdSortAndFilter;

public class GetDiscussionsByCategoryIdSortAndFilterHandler : IQueryHandler<GetDiscussionsByCategoryIdSortAndFilterQuery, GetDiscussionsByCategoryIdSortAndFilterResult>
{
    private readonly IDiscussionRepository _repository;
    private readonly IFilesService _filesService;

    public GetDiscussionsByCategoryIdSortAndFilterHandler(IDiscussionRepository repository, IFilesService filesService)
    {
        _repository = repository;
        _filesService = filesService;
    }

    public async Task<GetDiscussionsByCategoryIdSortAndFilterResult> Handle(GetDiscussionsByCategoryIdSortAndFilterQuery query, CancellationToken cancellationToken)
    {
        // Tách chuỗi tags thành List<string> nếu nó được truyền dưới dạng chuỗi
        List<string>? tagList = null;
        if (!string.IsNullOrEmpty(query.Tags))
        {
            tagList = query.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries)
                                .Select(tag => tag.Trim())
                                .ToList();
        }

        var allData = await _repository.GetByCategoryIdIsActiveAsync(query.CategoryId);

        // Lọc theo tags nếu có
        if (tagList != null && tagList.Count > 0)
        {
            allData = allData.Where(d => tagList.All(tag => d.Tags.Contains(tag, StringComparer.OrdinalIgnoreCase)));
        }

        // Sắp xếp theo orderBy
        allData = query.OrderBy?.ToLower() switch
        {
            // Sắp xếp theo mức độ "hot", tính toán dựa trên công thức kết hợp ViewCount, CommentCount và VoteCount
            "hot" => allData.OrderByDescending(d => (d.ViewCount * 0.5) + (d.Comments.Count() * 0.3) + (d.Votes.Count() * 0.2)),

            // Sắp xếp theo thời gian tạo, hiển thị bài viết mới nhất trước
            "newest" => allData.OrderByDescending(d => d.DateCreated),

            // Sắp xếp theo số lượt bình chọn, hiển thị bài viết có nhiều lượt bình chọn nhất trước
            "most votes" => allData.OrderByDescending(d => d.Votes.Count()),

            // Mặc định sắp xếp theo thời gian tạo nếu không có lựa chọn orderBy, hiển thị bài viết mới nhất trước
            _ => allData.OrderByDescending(d => d.DateCreated),
        };

        // Lấy thông tin phân trang
        var pageIndex = query.PaginationRequest.PageIndex;
        var pageSize = query.PaginationRequest.PageSize;
        var totalCount = allData.Count();

        var discussions = allData.Skip(pageSize * (pageIndex - 1)).Take(pageSize).ToList();

        // Sử dụng ToDiscussionDtoListAsync để chuyển đổi sang DTO
        var discussionDtos = await discussions.ToDiscussionDtoListAsync(_filesService);

        var discussionPaginateData = new PaginatedResult<DiscussionDto>(pageIndex, pageSize, totalCount, discussionDtos);

        return new GetDiscussionsByCategoryIdSortAndFilterResult(discussionPaginateData);
    }
}
