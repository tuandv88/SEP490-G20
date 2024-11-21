using Community.Application.Extensions;
using Community.Application.Models.Votes.Dtos;
using Community.Application.Models.Votes.Queries.GetVoteByIdDiscussion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community.Application.Models.Votes.Queries.GetVotesByIdComment;

public class GetVotesByIdCommentHandler : IQueryHandler<GetVotesByIdCommentQuery, GetVotesByIdCommentResult>
{
    private readonly IVoteRepository _repository;

    public GetVotesByIdCommentHandler(IVoteRepository repository)
    {
        _repository = repository;
    }

    public async Task<GetVotesByIdCommentResult> Handle(GetVotesByIdCommentQuery query, CancellationToken cancellationToken)
    {
        var allData = await _repository.GetAllVotesByIdCommentAsync(query.CommentId);

        // Lấy thông tin phân trang
        var pageIndex = query.PaginationRequest.PageIndex;
        var pageSize = query.PaginationRequest.PageSize;

        if (allData == null)
        {
            throw new ArgumentNullException($"Zero Votes by CommentId: {query.CommentId}");
        }

        var totalCount = allData.Count;

        var votes = allData.Skip(pageSize * (pageIndex - 1))
                              .Take(pageSize)
                              .ToList();

        var voteDtos = votes.Select(c => c.ToVoteDto()).ToList();

        var votesPaginateData = new PaginatedResult<VoteDto>(pageIndex, pageSize, totalCount, voteDtos);

        return new GetVotesByIdCommentResult(votesPaginateData);
    }
}