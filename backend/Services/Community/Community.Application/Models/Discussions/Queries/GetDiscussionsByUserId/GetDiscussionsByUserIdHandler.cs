using Community.Application.Extensions;
using Community.Application.Interfaces;
using Community.Application.Models.Discussions.Dtos;
using Community.Domain.ValueObjects;
using System.Linq;

namespace Community.Application.Models.Discussions.Queries.GetDiscussionsByUserId;

public class GetDiscussionsByUserIdHandler : IQueryHandler<GetDiscussionsByUserIdQuery, GetDiscussionsByUserIdResult>
{
    private readonly IDiscussionRepository _discussionRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IFlagRepository _flagRepository;
    private readonly IUserContextService _userContextService;

    public GetDiscussionsByUserIdHandler(IDiscussionRepository discussionRepository, ICategoryRepository categoryRepository, IFlagRepository flagRepository, IUserContextService userContextService)
    {
        _discussionRepository = discussionRepository;
        _categoryRepository = categoryRepository;
        _flagRepository = flagRepository;
        _userContextService = userContextService;
    }

    public async Task<GetDiscussionsByUserIdResult> Handle(GetDiscussionsByUserIdQuery query, CancellationToken cancellationToken)
    {
        var currentUserId = _userContextService.User.Id;

        if (currentUserId == null)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        var userId = UserId.Of(currentUserId);

        // Lấy tất cả thảo luận của người dùng
        var discussions = await _discussionRepository.GetAllDiscussionByUserIdAsync(userId.Value);

        if (discussions == null || !discussions.Any())
        {
            throw new NotFoundException("Not Find Discussions By User Id");
        }

        var discussionsQueryable = discussions.AsQueryable();

        // Áp dụng các phương thức LINQ
        if (!string.IsNullOrWhiteSpace(query.SearchKeyword))
        {
            discussionsQueryable = discussionsQueryable.Where(d => d.Title.Contains(query.SearchKeyword, StringComparison.OrdinalIgnoreCase) ||
                d.Description.Contains(query.SearchKeyword, StringComparison.OrdinalIgnoreCase));
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
            discussionsQueryable = discussionsQueryable.Where(d => tagList.All(tag => d.Tags.Contains(tag, StringComparer.OrdinalIgnoreCase)));
        }


        // Lấy thông tin phân trang
        var pageIndex = query.PaginationRequest.PageIndex;
        var pageSize = query.PaginationRequest.PageSize;

        // Tổng số thảo luận
        var totalCount = discussionsQueryable.Count();

        // Phân trang danh sách thảo luận
        var discussionsPagination = discussionsQueryable
                            .OrderByDescending(c => c.DateCreated)
                            .Skip(pageSize * (pageIndex - 1))
                            .Take(pageSize)
                            .ToList();

        // Sử dụng ToDiscussionDetailUserDtoListAsync để chuyển đổi sang DTO
        var discussionDetailUserDtos = await discussionsPagination.ToDiscussionDetailUserDtoListAsync(_categoryRepository, _flagRepository);

        // Tạo kết quả phân trang
        var discussionDetailUserDtoPagination = new PaginatedResult<DiscussionDetailUserDto>(pageIndex, pageSize, totalCount, discussionDetailUserDtos);

        return new GetDiscussionsByUserIdResult(discussionDetailUserDtoPagination);
    }
}

