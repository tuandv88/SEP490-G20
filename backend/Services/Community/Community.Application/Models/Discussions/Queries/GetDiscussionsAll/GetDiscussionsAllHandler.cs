using Community.Application.Extensions;
using Community.Application.Models.Discussions.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community.Application.Models.Discussions.Queries.GetDiscussionsAll;

public class GetDiscussionsAllHandler : IQueryHandler<GetDiscussionsAllQuery, GetDiscussionsAllResult>
{
    private readonly IDiscussionRepository _discussionRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IFlagRepository _flagRepository;

    public GetDiscussionsAllHandler(IDiscussionRepository discussionRepository, ICategoryRepository categoryRepository, IFlagRepository flagRepository)
    {
        _discussionRepository = discussionRepository;
        _categoryRepository = categoryRepository;
        _flagRepository = flagRepository;
    }

    public async Task<GetDiscussionsAllResult> Handle(GetDiscussionsAllQuery query, CancellationToken cancellationToken)
    {
        // Lấy tất cả thảo luận của người dùng
        var discussions = await _discussionRepository.GetDiscussionsAll();

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

        return new GetDiscussionsAllResult(discussionDetailUserDtoPagination);
    }
}
