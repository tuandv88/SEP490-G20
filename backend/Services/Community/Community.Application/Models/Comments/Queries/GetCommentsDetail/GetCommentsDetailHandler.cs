using Community.Application.Extensions;
using Community.Application.Models.Comments.Dtos;

namespace Community.Application.Models.Comments.Queries.GetCommentsDetail;
public class GetCommentsDetailHandler : IQueryHandler<GetCommentsDetailQuery, GetCommentsDetailResult>
{
    private readonly ICommentRepository _repository;

    public GetCommentsDetailHandler(ICommentRepository repository)
    {
        _repository = repository;
    }

    public async Task<GetCommentsDetailResult> Handle(GetCommentsDetailQuery query, CancellationToken cancellationToken)
    {
        var comments = await _repository.GetAllCommentDetailsAsync();

        var commentDtos = comments?.Select(c => c.ToCommentDetailDto()).ToList() ?? new List<CommentDetailDto>();

        return new GetCommentsDetailResult(commentDtos);
    }
}


