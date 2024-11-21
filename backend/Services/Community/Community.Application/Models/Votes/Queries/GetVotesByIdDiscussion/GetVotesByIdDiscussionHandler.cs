using Community.Application.Extensions;
using Community.Application.Models.Comments.Dtos;
using Community.Application.Models.Comments.Queries.GetCommentsByIdDiscussion;
using Community.Application.Models.Votes.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community.Application.Models.Votes.Queries.GetVoteByIdDiscussion;

public class GetVotesByIdDiscussionHandler : IQueryHandler<GetVotesByIdDiscussionQuery, GetVotesByIdDiscussionResult>
{
    private readonly IVoteRepository _repository;

    public GetVotesByIdDiscussionHandler(IVoteRepository repository)
    {
        _repository = repository;
    }

    public async Task<GetVotesByIdDiscussionResult> Handle(GetVotesByIdDiscussionQuery query, CancellationToken cancellationToken)
    {
        var allData = await _repository.GetAllVotesByIdDiscussionAsync(query.DiscussionId);

        // Lấy thông tin phân trang
        var pageIndex = query.PaginationRequest.PageIndex;
        var pageSize = query.PaginationRequest.PageSize;

        if (allData == null)
        {
            throw new ArgumentNullException($"Zero Votes by DiscussionId: {query.DiscussionId}");
        }

        var totalCount = allData.Count;

        var votes = allData.Skip(pageSize * (pageIndex - 1))
                              .Take(pageSize)
                              .ToList();

        // Chuyển đổi sang DTO
        var voteDtos = votes.Select(c => c.ToVoteDto()).ToList();

        var votesPaginateData = new PaginatedResult<VoteDto>(pageIndex, pageSize, totalCount, voteDtos);

        return new GetVotesByIdDiscussionResult(votesPaginateData);
    }
}


