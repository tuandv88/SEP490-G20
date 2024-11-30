using Community.Application.Extensions;
using Community.Application.Models.Comments.Dtos;
using Community.Application.Models.Comments.Queries.GetCommentsByIdDiscussion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community.Application.Models.Comments.Queries.GetCommentsByIdCommentParent;

public class GetCommentsByIdCommentParentHandler : IQueryHandler<GetCommentsByIdCommentParentQuery, GetCommentsByIdCommentParentResult>
{
    private readonly ICommentRepository _repository;

    public GetCommentsByIdCommentParentHandler(ICommentRepository repository)
    {
        _repository = repository;
    }

    public async Task<GetCommentsByIdCommentParentResult> Handle(GetCommentsByIdCommentParentQuery query, CancellationToken cancellationToken)
    {
        var allData = await _repository.GetAllCommentsByIdCommentParentAsync(query.DiscussionId, query.CommentParentId);

        // Lấy thông tin phân trang
        var pageIndex = query.PaginationRequest.PageIndex;
        var pageSize = query.PaginationRequest.PageSize;

        if (allData == null)
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

        return new GetCommentsByIdCommentParentResult(commentsPaginateData);
    }
}

