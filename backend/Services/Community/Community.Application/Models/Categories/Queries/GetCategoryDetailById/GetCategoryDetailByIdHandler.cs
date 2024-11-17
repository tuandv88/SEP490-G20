using Community.Application.Models.Categories.Dtos;
using Community.Application.Models.Categories.Queries.GetCategoryDetailById;
using Community.Application.Extensions;
using Community.Application.Models.Discussions.Dtos;

public class GetCategoryDetailByIdHandler : IQueryHandler<GetCategoryDetailByIdQuery, GetCategoryDetailByIdResult>
{
    private readonly ICategoryRepository _repository;
    private readonly IFilesService _filesService;

    public GetCategoryDetailByIdHandler(ICategoryRepository repository, IFilesService filesService)
    {
        _repository = repository;
        _filesService = filesService;
    }

    public async Task<GetCategoryDetailByIdResult> Handle(GetCategoryDetailByIdQuery query, CancellationToken cancellationToken)
    {
        // Lấy dữ liệu category chi tiết từ repository theo CategoryId
        var categoryData = await _repository.GetCategoryDetailByIdIsActiveAsync(query.CategoryId);

        if (categoryData == null)
        {
            throw new NotFoundException("Category not found Or IsActive: False");
        }

        // Lọc các Discussion của Category theo tags và OrderBy
        var discussions = categoryData.Discussions.AsQueryable();
        discussions = ProcessTagsAndSort(query, discussions);

        // Lấy thông tin phân trang
        var pageIndex = query.PaginationRequest.PageIndex;
        var pageSize = query.PaginationRequest.PageSize;
        var totalCount = discussions.Count();

        var paginatedDiscussions = discussions.Skip(pageSize * (pageIndex - 1)).Take(pageSize).ToList();

        // Chuyển đổi danh sách discussions sang DiscussionDetailDto
        var discussionDetailDtos = new List<DiscussionDetailDto>();
        foreach (var discussion in paginatedDiscussions)
        {
            var detailDto = await discussion.ToDiscussionDetailDtoAsync(_filesService);
            discussionDetailDtos.Add(detailDto);
        }

        // Tạo đối tượng CategoryDetailDto với danh sách DiscussionDetailDto đã phân trang
        var categoryDetailDto = new CategoryDetailDto(
            Id: categoryData.Id.Value,
            Name: categoryData.Name,
            Description: categoryData.Description,
            IsActive: categoryData.IsActive,
            Discussions: discussionDetailDtos
        );

        // Tạo kết quả trả về với PaginatedResult
        var paginatedCategoryDetailResult = new PaginatedResult<CategoryDetailDto>(
            pageIndex,
            pageSize,
            totalCount,
            new List<CategoryDetailDto> { categoryDetailDto }
        );

        return new GetCategoryDetailByIdResult(paginatedCategoryDetailResult);
    }

    // Hàm xử lý lọc theo tags và sắp xếp dữ liệu
    private IQueryable<Discussion> ProcessTagsAndSort(GetCategoryDetailByIdQuery query, IQueryable<Discussion> discussions)
    {
        // Tách chuỗi tags thành List<string> nếu có tags được truyền
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
            discussions = discussions.Where(d => tagList.All(tag => d.Tags.Contains(tag, StringComparer.OrdinalIgnoreCase)));
        }

        // Sắp xếp theo orderBy và ưu tiên thảo luận được ghim lên đầu
        discussions = query.OrderBy?.ToLower() switch
        {
            "hot" => discussions.OrderByDescending(d => d.Pinned)
                                .ThenByDescending(d => (d.ViewCount * 0.5) + (d.Comments.Count() * 0.3) + (d.Votes.Count() * 0.2)),
            "newest" => discussions.OrderByDescending(d => d.Pinned)
                                   .ThenByDescending(d => d.DateCreated),
            "most votes" => discussions.OrderByDescending(d => d.Pinned)
                                       .ThenByDescending(d => d.Votes.Count()),
            _ => discussions.OrderByDescending(d => d.Pinned)
                            .ThenByDescending(d => (d.ViewCount * 0.5) + (d.Comments.Count() * 0.3) + (d.Votes.Count() * 0.2)),
        };

        return discussions;
    }
}
