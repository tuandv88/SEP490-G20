using Community.Application.Extensions;
using Community.Application.Models.Discussions.Dtos;
using Community.Application.Models.Discussions.Queries.GetDiscussionsByCategoryIdSortAndFilter;
using System.Linq;

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
        var allData = await _repository.GetByCategoryIdIsActiveAsync(query.CategoryId);

        // Lọc và sắp xếp dữ liệu
        allData = ProcessTagsAndSort(query, allData);

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

    // Hàm xử lý lọc theo tags và sắp xếp dữ liệu
    private IQueryable<Discussion> ProcessTagsAndSort(GetDiscussionsByCategoryIdSortAndFilterQuery query, IQueryable<Discussion> allData)
    {
        if (!string.IsNullOrEmpty(query.keySearch))
        {
            var keySearchLower = query.keySearch.ToLower(); // Chuyển thành chữ thường để tìm kiếm không phân biệt chữ hoa chữ thường
            allData = allData.Where(d => d.Title.ToLower().Contains(keySearchLower) 
                                      || d.Description.ToLower().Contains(keySearchLower));
        }

        // Tách chuỗi tags thành List<string> nếu nó được truyền dưới dạng chuỗi
        List<string>? tagList = null;
        if (!string.IsNullOrEmpty(query.Tags))
        {
            tagList = query.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries)
                                .Select(tag => tag.Trim())
                                .ToList();
        }

        // Lọc theo tags nếu có
        if (tagList != null && tagList.Count > 0)
        {
            allData = allData.Where(d => tagList.All(tag => d.Tags.Contains(tag, StringComparer.OrdinalIgnoreCase)));
        }

        // Sắp xếp theo orderBy và ưu tiên thảo luận được ghim lên đầu
        allData = query.OrderBy?.ToLower() switch
        {
            // Sắp xếp theo mức độ "hot" và ưu tiên thảo luận được ghim lên đầu
            "hot" => allData.OrderByDescending(d => d.Pinned)
                            .ThenByDescending(d => (d.ViewCount * 0.5) + (d.Comments.Count() * 0.3) + (d.Votes.Count() * 0.2)),

            // Sắp xếp theo thời gian tạo, hiển thị bài viết mới nhất trước và ưu tiên thảo luận được ghim lên đầu
            "newest" => allData.OrderByDescending(d => d.Pinned)
                               .ThenByDescending(d => d.DateCreated),

            // Sắp xếp theo số lượt bình chọn và ưu tiên thảo luận được ghim lên đầu
            "most votes" => allData.OrderByDescending(d => d.Pinned)
                                   .ThenByDescending(d => d.Votes.Count()),

            // Mặc định là sắp xếp theo "hot" và ưu tiên thảo luận được ghim lên đầu
            _ => allData.OrderByDescending(d => d.Pinned)
                        .ThenByDescending(d => (d.ViewCount * 0.5) + (d.Comments.Count() * 0.3) + (d.Votes.Count() * 0.2)),
        };

        return allData;
    }

}
