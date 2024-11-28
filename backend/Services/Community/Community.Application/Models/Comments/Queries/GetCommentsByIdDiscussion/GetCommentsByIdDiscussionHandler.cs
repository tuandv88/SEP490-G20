using Community.Application.Extensions;
using Community.Application.Models.Comments.Dtos;

namespace Community.Application.Models.Comments.Queries.GetCommentsByIdDiscussion;

public class GetCommentsByIdDiscussionHandler : IQueryHandler<GetCommentsByIdDiscussionQuery, GetCommentsByIdDiscussionResult>
{
    private readonly ICommentRepository _repository;

    public GetCommentsByIdDiscussionHandler(ICommentRepository repository)
    {
        _repository = repository;
    }

    public async Task<GetCommentsByIdDiscussionResult> Handle(GetCommentsByIdDiscussionQuery query, CancellationToken cancellationToken)
    {
        var allData = await _repository.GetAllCommentsByIdDiscussionAsync(query.DiscussionId);

        // Lấy thông tin phân trang
        var pageIndex = query.PaginationRequest.PageIndex;
        var pageSize = query.PaginationRequest.PageSize;

        if(allData == null)
        {
            throw new ArgumentNullException($"Zero Comment by DiscussionId: {query.DiscussionId}");
        }

        var totalCount = allData.Count;

        var comments = allData.OrderByDescending(c => c.DateCreated)
                              .Skip(pageSize * (pageIndex - 1))
                              .Take(pageSize)
                              .ToList();

        // Chuyển đổi sang DTO
        var commentDtos = comments.Select(c => c.ToCommentsDetailDto()).ToList();

        var commentsPaginateData = new PaginatedResult<CommentsDetailDto>(pageIndex, pageSize, totalCount, commentDtos);

        return new GetCommentsByIdDiscussionResult(commentsPaginateData);
    }
}

