using Community.Application.Extensions;
using Community.Application.Models.Comments.Dtos;

namespace Community.Application.Models.Comments.Queries.GetCommentsPaging;

public class GetCommentsPagingHandler : IQueryHandler<GetCommentsPagingQuery, GetCommentsPagingResult>
{
    private readonly ICommentRepository _repository;

    public GetCommentsPagingHandler(ICommentRepository repository)
    {
        _repository = repository;
    }

    public async Task<GetCommentsPagingResult> Handle(GetCommentsPagingQuery query, CancellationToken cancellationToken)
    {
        var allData = await _repository.GetAllAsync();

        // Lấy thông tin phân trang
        var pageIndex = query.PaginationRequest.PageIndex;
        var pageSize = query.PaginationRequest.PageSize;

        var totalCount = allData.Count();

        var comments = allData.OrderBy(c => c.DateCreated)
                            .Skip(pageSize * (pageIndex - 1))
                            .Take(pageSize)
                            .ToList();

        // Sử dụng ToDiscussionDtoListAsync để chuyển đổi sang DTO
        var commentDtos = comments?.Select(c => c.ToCommentDto()).ToList() ?? new List<CommentDto>();

        var commentsPaginateData = new PaginatedResult<CommentDto>(pageIndex, pageSize, totalCount, commentDtos);

        return new GetCommentsPagingResult(commentsPaginateData);
    }
}
